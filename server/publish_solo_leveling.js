import http from 'http';
import https from 'https';

function fetchUrl(url, options = {}, bodyData = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const transport = parsedUrl.protocol === 'https:' ? https : http;
    
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = transport.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (bodyData) {
      req.write(typeof bodyData === 'object' ? JSON.stringify(bodyData) : bodyData);
    }
    req.end();
  });
}

async function publishSoloLevelingProduct() {
  console.log('=== PUBLISHING SOLO LEVELING ANIME PRODUCT TO LIVE WEBSITE ===');
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  
  // 1. Admin Sign In
  console.log('\n1. Signing in as Admin Owner (@OWNERAJMAL69)...');
  const loginRes = await fetchUrl(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    username: '@OWNERAJMAL69',
    password: 'AJMA6958@'
  });

  if (loginRes.status !== 200 || !loginRes.data.token) {
    console.error('❌ Admin Login Failed:', loginRes.data);
    return;
  }

  const token = loginRes.data.token;
  console.log('✓ Admin authenticated! Token received.');

  // 2. Publish Product
  const soloLevelingProduct = {
    name: 'Solo Leveling Sung Jin-Woo Shadow Monarch Glass Frame',
    categoryId: 'anime',
    price: 450,
    originalPrice: 850,
    stock: 25,
    description: 'Premium high-gloss frameless glass poster featuring Sung Jin-Woo, the Shadow Monarch from Solo Leveling. Handcrafted with 99.9% optical clarity and vibrant UV-resistant color depth.',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    isCustomizable: true,
    isFrame: true,
    frameMaterial: 'Tempered Acrylic Glass'
  };

  console.log('\n2. Sending Admin POST request to create product:');
  console.log(soloLevelingProduct);

  const addRes = await fetchUrl(`${baseUrl}/api/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, soloLevelingProduct);

  console.log('\nResponse Status Code:', addRes.status);
  console.log('Saved Product Result from Database:', addRes.data);

  if (addRes.status === 201) {
    console.log('\n3. Verifying product in store catalog (/api/products)...');
    const catalogRes = await fetchUrl(`${baseUrl}/api/products`);
    
    if (Array.isArray(catalogRes.data)) {
      const found = catalogRes.data.find(p => p.id === addRes.data.id || p.name.includes('Solo Leveling'));
      if (found) {
        console.log('✓ CONFIRMED SAVED: Solo Leveling Product is live in the store!', found);
      } else {
        console.log('Catalog list:', catalogRes.data);
      }
    }
  }
}

publishSoloLevelingProduct().catch(console.error);

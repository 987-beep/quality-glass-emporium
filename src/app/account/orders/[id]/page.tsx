import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { StoreService } from '@/lib/services/store-service';
import { CheckCircle2, Clock, Truck, FileText, ArrowLeft } from 'lucide-react';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
  searchParams: {
    success?: string;
  };
}

export default async function OrderDetailPage({ params, searchParams }: OrderDetailPageProps) {
  const order = await StoreService.getOrderById(params.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-8">
      {searchParams.success && (
        <div className="p-4 bg-success-green/10 border border-success-green/30 text-success-green rounded-xl text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" /> Your order has been submitted successfully! Payment proof is now pending admin review.
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <Link href="/account/orders" className="text-xs text-secondary font-bold hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
          </Link>
          <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-primary dark:text-primary-fixed">
            Order {order.order_number}
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <div className="text-right">
          <span className="font-display-lg text-2xl font-bold text-primary dark:text-primary-fixed">
            ${order.total_amount.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop">
        <div className="lg:col-span-8 space-y-6">
          {/* Status Tracker */}
          <div className="glass-panel p-6 rounded-xl border border-outline-variant/30 space-y-4">
            <h2 className="font-headline-md text-base font-bold text-primary">Fulfillment & Payment Status</h2>
            <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-center gap-3">
              {order.status === 'pending_payment' && (
                <>
                  <Clock className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <p className="font-bold text-sm text-amber-900">Payment Pending Approval</p>
                    <p className="text-xs text-on-surface-variant">Your receipt has been uploaded and is being reviewed by our store manager.</p>
                  </div>
                </>
              )}
              {order.status === 'payment_approved' && (
                <>
                  <CheckCircle2 className="w-6 h-6 text-success-green shrink-0" />
                  <div>
                    <p className="font-bold text-sm text-success-green">Payment Approved</p>
                    <p className="text-xs text-on-surface-variant">Your payment proof has been verified. Your custom frame is now in preparation.</p>
                  </div>
                </>
              )}
              {order.status === 'shipped' && (
                <>
                  <Truck className="w-6 h-6 text-blue-600 shrink-0" />
                  <div>
                    <p className="font-bold text-sm text-blue-900">Shipped ({order.carrier_name})</p>
                    <p className="text-xs text-on-surface-variant">Tracking Number: <strong>{order.tracking_number}</strong></p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 space-y-4">
            <h2 className="font-headline-md text-base font-bold text-primary">Items in Order</h2>
            <div className="space-y-3 divide-y divide-outline-variant/10">
              {order.items?.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-sm text-primary">{item.product_name}</p>
                    {item.custom_config?.finish && <p className="text-on-surface-variant">Finish: {item.custom_config.finish}</p>}
                    <p className="text-on-surface-variant">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-sm text-primary">${item.subtotal.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping & Payment Proof Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 space-y-3 text-xs">
            <h3 className="font-label-md text-sm font-bold text-primary">Shipping Address</h3>
            <p className="font-bold text-on-surface">{order.shipping_address.full_name}</p>
            <p className="text-on-surface-variant">{order.shipping_address.street}</p>
            <p className="text-on-surface-variant">{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}</p>
            <p className="text-on-surface-variant">Phone: {order.shipping_address.phone}</p>
          </div>

          {order.payment_proof_url && (
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 space-y-3 text-xs">
              <h3 className="font-label-md text-sm font-bold text-primary">Payment Proof Receipt</h3>
              <div className="relative aspect-video rounded-lg overflow-hidden border">
                <Image src={order.payment_proof_url} alt="Payment Receipt" fill className="object-cover" />
              </div>
              <a
                href={order.payment_proof_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary font-bold hover:underline flex items-center gap-1 text-xs"
              >
                <FileText className="w-4 h-4" /> Open Receipt in Full Size ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

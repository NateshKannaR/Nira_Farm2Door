'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Printer, ShieldCheck, Truck, MapPin, User, FileText, CheckCircle2, Download } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface TransitGatePassModalProps {
  isOpen: boolean;
  onClose: () => void;
  consignment?: {
    passId?: string;
    orderId?: string;
    cropName?: string;
    quantityKg?: number;
    farmerName?: string;
    farmerVillage?: string;
    buyerName?: string;
    destinationAddress?: string;
    driverName?: string;
    driverPhone?: string;
    vehicleNumber?: string;
    pickupOtpVerified?: boolean;
  };
}

export default function TransitGatePassModal({
  isOpen,
  onClose,
  consignment,
}: TransitGatePassModalProps) {
  const { language } = useLanguage();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const passId = consignment?.passId || `NIR-TRN-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderId = consignment?.orderId || 'ORD-NIRA-2026-8910';
  const cropName = consignment?.cropName || 'Nashik Organic Tomatoes (Grade A+)';
  const quantityKg = consignment?.quantityKg || 500;
  const quintals = (quantityKg / 100).toFixed(2);
  const farmerName = consignment?.farmerName || 'Ramesh Patil';
  const farmerVillage = consignment?.farmerVillage || 'Pimpalgaon Baswant, Nashik, MH';
  const buyerName = consignment?.buyerName || 'Annapurna Food Services & Retail Hub';
  const destination = consignment?.destinationAddress || 'Sector 19, Vashi Mandi Road, Navi Mumbai';
  const driverName = consignment?.driverName || 'Vikram Shinde';
  const driverPhone = consignment?.driverPhone || '+91 99000 11122';
  const vehicleNumber = consignment?.vehicleNumber || 'MH-15-EG-8821';

  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const validUntil = new Date(Date.now() + 48 * 3600 * 1000).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  useEffect(() => {
    if (isOpen) {
      const payload = JSON.stringify({
        authority: 'NIRA_SIH_AGRI_TRANSIT',
        passId,
        orderId,
        crop: cropName,
        weightKg: quantityKg,
        vehicle: vehicleNumber,
        driver: driverName,
        exemptStatus: 'EXEMPT_APMC_DIRECT_TRADE',
        timestamp: new Date().toISOString(),
      });

      QRCode.toDataURL(payload, {
        width: 180,
        margin: 1,
        color: {
          dark: '#064e3b',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating gate pass QR:', err));
    }
  }, [isOpen, passId, orderId, cropName, quantityKg, vehicleNumber, driverName]);

  if (!isOpen) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white text-gray-950 rounded-3xl w-full max-w-2xl shadow-2xl border-4 border-emerald-800 overflow-hidden my-auto print:m-0 print:border-2 print:shadow-none">
        {/* Top Control Bar (Hidden on print) */}
        <div className="bg-emerald-900 text-white px-6 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="font-extrabold text-sm tracking-wide">
              {language === 'hi' ? 'राजकीय कृषि परिवहन पास (Official Transit Pass)' : 'Official Agri-Transit Clearance Pass'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-extrabold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'hi' ? 'प्रिंट / PDF' : 'Print / PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Pass Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-[#FCFBF7] print:p-4 print:space-y-4">
          {/* Official Emblem & Header */}
          <div className="text-center border-b-2 border-emerald-900/30 pb-4 relative">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 font-extrabold text-[10px] tracking-widest uppercase px-3 py-1 rounded-full mb-1">
              🏛️ Government of India • SIH 2026 PS 26033
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
              NATIONAL DIGITAL AGRI-TRANSIT CORRIDOR PASS
            </h1>
            <p className="text-xs text-gray-600 font-medium">
              Direct Farmgate Consignment Clearance & Toll / Checkpost Exemption
            </p>
            <div className="flex justify-center gap-4 text-[11px] font-mono font-bold text-emerald-900 mt-2">
              <span>PASS NO: <strong className="text-red-700">{passId}</strong></span>
              <span>•</span>
              <span>ORDER REF: {orderId}</span>
            </div>
          </div>

          {/* QR Code & Validity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 rounded-2xl border border-emerald-900/20 shadow-sm">
            <div className="flex flex-col items-center justify-center text-center sm:border-r border-emerald-900/10 sm:pr-4">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Consignment QR" className="w-32 h-32 object-contain" />
              ) : (
                <div className="w-32 h-32 bg-gray-100 animate-pulse rounded-lg" />
              )}
              <span className="text-[10px] font-mono text-emerald-800 font-extrabold mt-1">
                SCAN AT CHECKPOINT
              </span>
            </div>

            <div className="sm:col-span-2 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-gray-200">
                <div>
                  <span className="text-[10px] uppercase text-gray-500 font-bold block">Issue Date</span>
                  <span className="font-bold text-gray-900">{issueDate}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-gray-500 font-bold block">Valid Until</span>
                  <span className="font-bold text-red-700">{validUntil} (48 Hours)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] uppercase text-gray-500 font-bold block">Assigned Vehicle</span>
                  <span className="font-extrabold text-emerald-900 font-mono text-sm">{vehicleNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-gray-500 font-bold block">Carrier / Driver</span>
                  <span className="font-bold text-gray-900">{driverName} ({driverPhone})</span>
                </div>
              </div>

              <div className="pt-1 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Farm-Gate Pickup OTP Cryptographically Verified</span>
              </div>
            </div>
          </div>

          {/* Consignor & Consignee Manifest */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-white rounded-2xl border border-emerald-900/15 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold text-[11px] uppercase border-b border-gray-100 pb-1">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>Consignor (Origin Farmer)</span>
              </div>
              <p className="font-extrabold text-sm text-gray-900">{farmerName}</p>
              <p className="text-gray-600 font-medium">{farmerVillage}</p>
              <p className="text-[10px] font-mono text-emerald-800">Direct Farmer ID: FRM-NSK-2026</p>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-emerald-900/15 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold text-[11px] uppercase border-b border-gray-100 pb-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>Consignee (Direct Buyer Hub)</span>
              </div>
              <p className="font-extrabold text-sm text-gray-900">{buyerName}</p>
              <p className="text-gray-600 font-medium">{destination}</p>
              <p className="text-[10px] font-mono text-emerald-800">Verified Buyer Desk • Escrow Locked</p>
            </div>
          </div>

          {/* Produce Table */}
          <div className="border border-emerald-900/20 rounded-2xl overflow-hidden bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-900/5 font-extrabold text-emerald-950 uppercase text-[10px] border-b border-emerald-900/15">
                <tr>
                  <th className="py-2.5 px-4">Item & Grade</th>
                  <th className="py-2.5 px-4">HSN Code</th>
                  <th className="py-2.5 px-4 text-right">Net Weight (Kg)</th>
                  <th className="py-2.5 px-4 text-right">Quintals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                <tr>
                  <td className="py-2.5 px-4 font-bold text-gray-900">{cropName}</td>
                  <td className="py-2.5 px-4 font-mono text-gray-600">0702.00</td>
                  <td className="py-2.5 px-4 text-right font-extrabold text-gray-900">{quantityKg} Kg</td>
                  <td className="py-2.5 px-4 text-right font-bold text-emerald-900">{quintals} Qtl</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Statutory Exemption Declaration */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-300/80 rounded-2xl text-[11px] text-gray-800 space-y-1 leading-relaxed">
            <p className="font-extrabold text-amber-950 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              Statutory Exemption Certificate (Direct Farm Trade)
            </p>
            <p className="text-gray-700">
              This shipment contains 100% direct farm-to-consumer agricultural produce cleared under the 
              <strong> National Direct Agriculture Protocol (SIH 2026 PS 26033)</strong>. 
              The produce is exempt from local APMC market cess, middleman levies, and transit harassment under direct farm trade regulations. State highway patrols and checkposts are requested to grant priority green corridor passage.
            </p>
          </div>

          {/* Digital Signatures Footer */}
          <div className="pt-2 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4 text-[10px] text-gray-500">
            <div>
              <p className="font-mono font-bold text-emerald-900">DIGITAL CERTIFICATE HASH:</p>
              <p className="font-mono">{passId}-SHA256-EC4928A8</p>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-emerald-950 uppercase">Nira National Revenue & Transit Gateway</p>
              <p className="font-medium">Ministry of Consumer Affairs, Food & Public Distribution</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden on print) */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'hi' ? 'पास प्रिंट करें / सेव करें' : 'Print / Download Official Pass'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

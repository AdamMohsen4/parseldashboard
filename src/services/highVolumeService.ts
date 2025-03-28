import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';
import { HighVolumeShipment } from '@/types/shipment';

export async function processHighVolumeShipment(
  shipment: HighVolumeShipment,
  userId: string
): Promise<{ success: boolean; message: string; trackingCodes?: string[] }> {
  try {
    console.log('Processing high volume shipment for user:', userId);
    
    // Map business info to match the table structure
    const { data: businessData, error: businessError } = await supabase
      .from('high_volume_businesses')
      .insert({
        name: shipment.businessInfo.name,
        vat_number: shipment.businessInfo.contactName, // Note: using contactName as vat_number temporarily
        address: shipment.businessInfo.address,
        city: shipment.businessInfo.city,
        postal_code: shipment.businessInfo.postalCode,
        country: shipment.businessInfo.country,
        contact_person: shipment.businessInfo.contactName,
        email: shipment.businessInfo.email,
        phone: shipment.businessInfo.phone
      })
      .select()
      .single();

    if (businessError) {
      console.error('Error inserting business data:', businessError);
      throw new Error(`Failed to save business information: ${businessError.message}`);
    }

    // Generate tracking codes for shipments
    const trackingCodes = shipment.shipments.map(() => 
      `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    );

    // Map shipment data to match the table structure
    const shipmentRecords = shipment.shipments.map((s, index) => ({
      business_id: businessData.id,
      tracking_code: trackingCodes[index],
      recipient_name: s.recipient.name,
      recipient_address: s.recipient.address,
      recipient_city: s.recipient.city,
      recipient_postal_code: s.recipient.postalCode,
      recipient_country: s.recipient.country,
      package_weight: s.package.weight,
      package_length: s.package.length,
      package_width: s.package.width,
      package_height: s.package.height,
      special_instructions: s.specialInstructions || null,
      label_url: null, // Will be generated in a real implementation
      status: 'pending'
    }));

    const { error: shipmentError } = await supabase
      .from('high_volume_shipments')
      .insert(shipmentRecords);

    if (shipmentError) {
      console.error('Error inserting shipment data:', shipmentError);
      throw new Error(`Failed to save shipment information: ${shipmentError.message}`);
    }

    // Send confirmation email
    try {
      await sendEmail({
        to: shipment.businessInfo.email,
        subject: 'High Volume Shipment Confirmation',
        template: 'high-volume-confirmation',
        data: {
          businessName: shipment.businessInfo.name,
          totalShipments: shipment.totalPackages,
          processedShipments: shipment.shipments.length,
          failedShipments: 0,
          trackingCodes
        }
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't throw here, as the shipments were processed successfully
    }

    return {
      success: true,
      message: 'High volume shipment processed successfully',
      trackingCodes
    };
  } catch (error) {
    console.error('Error processing high volume shipment:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to process high volume shipment');
  }
} 
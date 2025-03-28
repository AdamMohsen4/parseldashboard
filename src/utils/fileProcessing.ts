import * as XLSX from 'xlsx';
import { ShipmentData } from '@/types/shipment';

export const processCSVFile = async (file: File): Promise<ShipmentData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0];
        
        // Validate headers
        const requiredHeaders = [
          'recipientName',
          'recipientAddress',
          'recipientCity',
          'recipientPostalCode',
          'recipientCountry',
          'packageWeight',
          'packageLength',
          'packageWidth',
          'packageHeight'
        ];

        const missingHeaders = requiredHeaders.filter(
          header => !headers.includes(header)
        );

        if (missingHeaders.length > 0) {
          throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
        }

        // Process data rows
        const shipments: ShipmentData[] = rows.slice(1)
          .filter(row => row.length === headers.length && row.some(cell => cell.trim()))
          .map(row => {
            const shipment: any = {};
            headers.forEach((header, index) => {
              shipment[header.trim()] = row[index].trim();
            });

            // Convert numeric values
            shipment.packageWeight = parseFloat(shipment.packageWeight);
            shipment.packageLength = parseFloat(shipment.packageLength);
            shipment.packageWidth = parseFloat(shipment.packageWidth);
            shipment.packageHeight = parseFloat(shipment.packageHeight);

            return shipment as ShipmentData;
          });

        resolve(shipments);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

export const processExcelFile = async (file: File): Promise<ShipmentData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        // Validate headers
        const requiredHeaders = [
          'recipientName',
          'recipientAddress',
          'recipientCity',
          'recipientPostalCode',
          'recipientCountry',
          'packageWeight',
          'packageLength',
          'packageWidth',
          'packageHeight'
        ];

        const headers = Object.keys(jsonData[0] || {});
        const missingHeaders = requiredHeaders.filter(
          header => !headers.includes(header)
        );

        if (missingHeaders.length > 0) {
          throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
        }

        // Process data rows
        const shipments: ShipmentData[] = jsonData.map((row: any) => {
          const shipment: any = {};
          requiredHeaders.forEach(header => {
            shipment[header] = row[header];
          });

          // Convert numeric values
          shipment.packageWeight = parseFloat(shipment.packageWeight);
          shipment.packageLength = parseFloat(shipment.packageLength);
          shipment.packageWidth = parseFloat(shipment.packageWidth);
          shipment.packageHeight = parseFloat(shipment.packageHeight);

          return shipment as ShipmentData;
        });

        resolve(shipments);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsArrayBuffer(file);
  });
};

export const validateShipmentData = (shipments: ShipmentData[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  shipments.forEach((shipment, index) => {
    // Validate required fields
    if (!shipment.recipientName) errors.push(`Row ${index + 1}: Missing recipient name`);
    if (!shipment.recipientAddress) errors.push(`Row ${index + 1}: Missing recipient address`);
    if (!shipment.recipientCity) errors.push(`Row ${index + 1}: Missing recipient city`);
    if (!shipment.recipientPostalCode) errors.push(`Row ${index + 1}: Missing recipient postal code`);
    if (!shipment.recipientCountry) errors.push(`Row ${index + 1}: Missing recipient country`);

    // Validate numeric fields
    if (isNaN(shipment.packageWeight) || shipment.packageWeight <= 0) {
      errors.push(`Row ${index + 1}: Invalid package weight`);
    }
    if (isNaN(shipment.packageLength) || shipment.packageLength <= 0) {
      errors.push(`Row ${index + 1}: Invalid package length`);
    }
    if (isNaN(shipment.packageWidth) || shipment.packageWidth <= 0) {
      errors.push(`Row ${index + 1}: Invalid package width`);
    }
    if (isNaN(shipment.packageHeight) || shipment.packageHeight <= 0) {
      errors.push(`Row ${index + 1}: Invalid package height`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}; 
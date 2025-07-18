import { Metadata } from 'next';
import PdfEditor from '@/components/PdfEditor';

export const metadata: Metadata = {
  title: 'Professional PDF Editor - Edit PDFs Like Adobe',
  description: 'Professional PDF editor with advanced features - edit text, add images, create forms, and more. Better than basic annotation tools.',
  keywords: ['pdf editor', 'edit pdf', 'pdf text editor', 'professional pdf editor', 'pdf annotation', 'pdf tools'],
};

export default function PdfEditorPage() {
  return <PdfEditor />;
}

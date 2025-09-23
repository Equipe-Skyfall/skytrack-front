import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

export const useEducacao = () => {
  const navigate = useNavigate();

  const voltarParaDashboard = () => {
    navigate('/dashboard');
  };

  const gerarRelatorioPdf = (titulo: string, fileName: string, conteudos: string[]) => {
    const doc = new jsPDF();
    
    doc.setFont('poppins', 'bold');
    doc.setFontSize(16);
    doc.text(titulo, 20, 20);
    
    doc.setFont('poppins', 'normal');
    doc.setFontSize(12);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 30);
    
    conteudos.forEach((conteudo, index) => {
      doc.text(conteudo, 20, 40 + (index * 10));
    });
    
    doc.save(fileName);
  };

  return { voltarParaDashboard, gerarRelatorioPdf };
};
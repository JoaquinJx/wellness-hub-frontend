import React from 'react';
import jsPDF from 'jspdf';
import Papa from 'papaparse';
import api from '../services/api';

interface ExportData {
  fitness?: any[];
  health?: any[];
  nutrition?: any[];
  sleep?: any[];
  meditation?: any[];
  hydration?: any[];
  goals?: any[];
}

const ExportComponent: React.FC = () => {
  const fetchAllData = async (): Promise<ExportData> => {
    try {
      const [fitness, health, nutrition, sleep, meditation, hydration, goals] = await Promise.all([
        api.get('/fitness').catch(() => ({ data: [] })),
        api.get('/health').catch(() => ({ data: [] })),
        api.get('/nutrition').catch(() => ({ data: [] })),
        api.get('/sleep').catch(() => ({ data: [] })),
        api.get('/meditation').catch(() => ({ data: [] })),
        api.get('/hydration').catch(() => ({ data: [] })),
        api.get('/goals').catch(() => ({ data: [] }))
      ]);

      return {
        fitness: fitness.data,
        health: health.data,
        nutrition: nutrition.data,
        sleep: sleep.data,
        meditation: meditation.data,
        hydration: hydration.data,
        goals: goals.data
      };
    } catch (error) {
      console.error('Error fetching data for export:', error);
      return {};
    }
  };

  const exportToPDF = async () => {
    try {
      const data = await fetchAllData();
      const pdf = new jsPDF();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 10;

      // Título
      pdf.setFontSize(20);
      pdf.text('Reporte de Bienestar', 10, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 10, yPosition);
      yPosition += 10;

      // Función auxiliar para añadir sección
      const addSection = (title: string, items: any[]) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 10;
        }

        pdf.setFontSize(14);
        pdf.setTextColor(51, 65, 85); // slate-700
        pdf.text(title, 10, yPosition);
        yPosition += 8;

        if (items && items.length > 0) {
          pdf.setFontSize(10);
          pdf.setTextColor(100);
          items.slice(0, 5).forEach((item: any) => {
            if (yPosition > pageHeight - 10) {
              pdf.addPage();
              yPosition = 10;
            }
            const text = `• ${JSON.stringify(item).substring(0, 60)}...`;
            pdf.text(text, 15, yPosition);
            yPosition += 6;
          });
        }

        yPosition += 5;
      };

      // Añadir secciones
      addSection('📊 Fitness', data.fitness || []);
      addSection('❤️ Salud', data.health || []);
      addSection('🥗 Nutrición', data.nutrition || []);
      addSection('😴 Sueño', data.sleep || []);
      addSection('🧘 Meditación', data.meditation || []);
      addSection('💧 Hidración', data.hydration || []);
      addSection('🎯 Metas', data.goals || []);

      pdf.save(`reporte-bienestar-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Error al exportar a PDF');
    }
  };

  const exportToCSV = async () => {
    try {
      const data = await fetchAllData();

      // Preparar datos para CSV
      const csvData: any[] = [];

      // Fitness
      if (data.fitness && data.fitness.length > 0) {
        csvData.push({
          Módulo: 'Fitness',
          ...data.fitness[0]
        });
      }

      // Health
      if (data.health && data.health.length > 0) {
        csvData.push({
          Módulo: 'Salud',
          ...data.health[0]
        });
      }

      // Nutrition
      if (data.nutrition && data.nutrition.length > 0) {
        csvData.push({
          Módulo: 'Nutrición',
          ...data.nutrition[0]
        });
      }

      // Sleep
      if (data.sleep && data.sleep.length > 0) {
        csvData.push({
          Módulo: 'Sueño',
          ...data.sleep[0]
        });
      }

      // Meditation
      if (data.meditation && data.meditation.length > 0) {
        csvData.push({
          Módulo: 'Meditación',
          ...data.meditation[0]
        });
      }

      // Hydration
      if (data.hydration && data.hydration.length > 0) {
        csvData.push({
          Módulo: 'Hidración',
          ...data.hydration[0]
        });
      }

      // Goals
      if (data.goals && data.goals.length > 0) {
        csvData.push({
          Módulo: 'Metas',
          ...data.goals[0]
        });
      }

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `datos-bienestar-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      alert('Error al exportar a CSV');
    }
  };

  return (
    <div className="flex gap-4">
      <button onClick={exportToPDF} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors" title="Descargar reporte en PDF">
        📄 PDF
      </button>
      <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors" title="Descargar datos en CSV">
        📊 CSV
      </button>
    </div>
  );
};

export default ExportComponent;

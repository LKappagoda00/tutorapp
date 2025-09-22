import React, { useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const studentMarks = [
    { subject: 'Math', mark: 42 },
    { subject: 'Science', mark: 67 },
    { subject: 'English', mark: 55 },
    { subject: 'History', mark: 38 },
    { subject: 'Geography', mark: 72 },
];

function getAnalysis(mark) {
    if (mark < 45) return 'Needs to study well';
    if (mark < 60) return 'Can improve';
    return 'Good performance';
}

const data = {
    labels: studentMarks.map(m => m.subject),
    datasets: [
        {
            label: 'Marks',
            data: studentMarks.map(m => m.mark),
            backgroundColor: studentMarks.map(m =>
                m.mark < 45 ? 'rgba(255, 99, 132, 0.6)' :
                m.mark < 60 ? 'rgba(255, 206, 86, 0.6)' :
                'rgba(75, 192, 192, 0.6)'
            ),
        },
    ],
};

const options = {
    scales: {
        y: { beginAtZero: true, max: 100 },
    },
};

function MarksAnalysis() {
    const reportRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const downloadPDF = async () => {
        if (!reportRef.current) return;
        
        setIsGenerating(true);
        try {
            // Wait for chart to be fully rendered
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get the container element
            const element = reportRef.current;
            
            // Temporarily apply absolute positioning to ensure proper rendering
            const originalStyles = element.style.cssText;
            element.style.position = 'fixed';
            element.style.top = '0';
            element.style.left = '0';
            element.style.width = '800px'; // Fixed width for consistency
            element.style.backgroundColor = 'white';
            element.style.zIndex = '9999';

            // Create canvas with higher resolution
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                allowTaint: true,
                foreignObjectRendering: true,
                // Ensure charts and other elements are captured
                onclone: (clonedDoc, clonedElement) => {
                    clonedElement.style.width = '800px';
                    // Force visible state
                    Array.from(clonedElement.getElementsByTagName('*')).forEach(el => {
                        el.style.visibility = 'visible';
                        if (getComputedStyle(el).display === 'none') {
                            el.style.display = 'block';
                        }
                    });
                }
            });

            // Restore original styles
            element.style.cssText = originalStyles;
            
            // Create PDF with better quality
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Create PDF with appropriate size
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Add image with better positioning
            const positionX = (210 - imgWidth) / 2; // Center horizontally
            pdf.addImage(
                canvas.toDataURL('image/png', 1.0),
                'PNG',
                positionX,
                0,
                imgWidth,
                imgHeight,
                '',
                'FAST'
            );
            
            pdf.save('marks-analysis-report.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-xl p-6 mx-auto mt-8 bg-white rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#1D4ED8' }}>Marks Analysis Report</h2>
                <button
                    onClick={downloadPDF}
                    disabled={isGenerating}
                    className="px-4 py-2 text-white transition-colors rounded-lg"
                    style={{
                        backgroundColor: isGenerating ? '#9CA3AF' : '#2563EB',
                        cursor: isGenerating ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isGenerating ? 'Generating PDF...' : 'Download PDF'}
                </button>
            </div>
            <div ref={reportRef} className="bg-white">
                <div className="p-4 mb-6 rounded-lg bg-gray-50">
                <Bar data={data} options={options} />
                </div>
                <ul className="mb-6 space-y-3">
                    {studentMarks.map((m, idx) => (
                    <li
                        key={idx}
                        className="flex items-center justify-between p-3 transition-colors border rounded-lg"
                        style={{
                            backgroundColor: m.mark < 45 ? '#FEF2F2' : m.mark < 60 ? '#FEFCE8' : '#F0FDF4',
                            borderColor: m.mark < 45 ? '#FECACA' : m.mark < 60 ? '#FEF08A' : '#BBF7D0'
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <span className="font-semibold" style={{ color: '#374151' }}>{m.subject}</span>
                            <span className="px-3 py-1 rounded-full" style={{
                                backgroundColor: m.mark < 45 ? '#FEE2E2' : m.mark < 60 ? '#FEF9C3' : '#DCFCE7',
                                color: m.mark < 45 ? '#B91C1C' : m.mark < 60 ? '#854D0E' : '#166534'
                            }}>
                                {m.mark}%
                            </span>
                        </div>
                        <span className="text-sm" style={{
                            color: m.mark < 45 ? '#DC2626' : m.mark < 60 ? '#CA8A04' : '#16A34A'
                        }}>
                            {getAnalysis(m.mark)}
                        </span>
                    </li>
                ))}
            </ul>
            <div className="p-4 text-sm border-t" style={{ color: '#4B5563' }}>
                <h3 className="mb-2 font-bold" style={{ color: '#374151' }}>Performance Guide:</h3>
                <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FECACA' }}></span>
                        Below 45: Needs focused attention and regular practice
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FEF08A' }}></span>
                        45-60: Shows potential, continue working on improvements
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#BBF7D0' }}></span>
                        Above 60: Good performance, maintain consistency
                    </li>
                </ul>
            </div>
            </div>
        </div>
    );
}

export default MarksAnalysis;
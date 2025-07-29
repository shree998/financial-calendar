import React, { useRef, useState } from 'react';
import {
  Drawer, Box, Typography, Divider, useTheme, Button, Menu, MenuItem
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Area, Line, Brush, LineChart
} from 'recharts';
import { format } from 'date-fns';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

const formatAxisCurrency = (tick) => `$${tick.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;


const DashboardPanel = ({ open, onClose, data, financialInstrument }) => {
  const theme = useTheme();
  const chartRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const exportMenuOpen = Boolean(anchorEl);

  if (!data) return null;

 
  const handleExportClick = (event) => setAnchorEl(event.currentTarget);
  const handleExportClose = () => setAnchorEl(null);


  const exportToCsv = () => {

    if (!data.dailyData) return;
    const csvData = data.dailyData.map(d => ({
      date: format(new Date(d.openTime), 'yyyy-MM-dd'),
      open: d.open, high: d.high, low: d.low, close: d.close,
      volume: d.volume, sma_20: d.sma?.toFixed(2) || 'N/A', rsi_14: d.rsi?.toFixed(2) || 'N/A',
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${financialInstrument}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleExportClose();
  };

  const exportToPdf = async () => {
    const chartElement = chartRef.current;
    if (!chartElement) return;

    const canvas = await html2canvas(chartElement, { backgroundColor: theme.palette.background.paper });
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    doc.setFontSize(18);
    doc.text(`Financial Report: ${format(data.startDate, 'MMM d, yyyy')} - ${format(data.endDate, 'MMM d, yyyy')}`, 14, 20);
    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const imgHeight = (imgProps.height * (pdfWidth - 28)) / imgProps.width;
    doc.addImage(imgData, 'PNG', 14, 30, pdfWidth - 28, imgHeight);
    autoTable(doc, {
        head: [["Date", "Open", "High", "Low", "Close", "Volume", "SMA(20)", "RSI(14)"]],
        body: data.dailyData.map(item => [
            format(new Date(item.openTime), 'yyyy-MM-dd'),
            item.open.toFixed(2),
            item.high.toFixed(2),
            item.low.toFixed(2),
            item.close.toFixed(2),
            item.volume.toLocaleString(),
            item.sma ? item.sma.toFixed(2) : 'N/A',
            item.rsi ? item.rsi.toFixed(2) : 'N/A'
        ]),
        startY: 35 + imgHeight,
        theme: 'grid',
        headStyles: { fillColor: [22, 160, 133] },
    });
    doc.save('financial_report.pdf');
    handleExportClose();
  };



  const getTitle = () => {
    switch(data.periodType) {
        case 'Range': return 'Custom Range Analysis';
        case 'Weekly': return 'Weekly Summary';
        case 'Monthly': return 'Monthly Summary';
        default: return `Details for ${format(new Date(data.openTime), 'PPPP')}`;
    }
  };
  
  const getDateSubtitle = () => {
    if (data.periodType !== 'Daily') {
        return `${format(data.startDate, 'MMM d, yyyy')} - ${format(data.endDate, 'MMM d, yyyy')}`;
    }
    return null;
  };


  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 600, padding: 3 }} role="presentation">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
                <Typography variant="h5" gutterBottom>{getTitle()}</Typography>
                <Typography variant="subtitle1" color="text.secondary">{getDateSubtitle()}</Typography>
            </Box>
         
            {data.periodType === 'Range' && (
                <>
                    <Button variant="contained" onClick={handleExportClick} aria-label='export data' startIcon={<FileDownloadIcon />}>Export</Button>
                    <Menu anchorEl={anchorEl} open={exportMenuOpen} onClose={handleExportClose}>
                        <MenuItem onClick={exportToCsv}>Export as CSV</MenuItem>
                        <MenuItem onClick={exportToPdf}>Export as PDF</MenuItem>
                    </Menu>
                </>
            )}
        </Box>
        <Divider sx={{ mb: 2 }} />

   
        <Box ref={chartRef}>
            <Typography><strong>Open:</strong> ${data.open.toFixed(2)}</Typography>
            <Typography><strong>High:</strong> ${data.high.toFixed(2)}</Typography>
            <Typography><strong>Low:</strong> ${data.low.toFixed(2)}</Typography>
            <Typography><strong>Close:</strong> ${data.close.toFixed(2)}</Typography>
            <Typography><strong>Total Volume:</strong> {data.volume.toLocaleString()}</Typography>
            <Typography><strong>Avg. Volatility:</strong> {data.volatility.toFixed(2)}%</Typography>
            <Typography><strong>Performance:</strong> {data.priceChangePercent.toFixed(2)}%</Typography>
            <Divider sx={{ my: 2 }} />

            {(data.periodType === 'Range' && data.startDate!==data.endDate) ? (
                <>
                    <Typography variant="h6">Price & SMA (20)</Typography>
                    <ResponsiveContainer width="100%" height={250}>
                        <ComposedChart data={data.dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
                            <defs><linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/><stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/></linearGradient></defs>
                            <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3" />
                            <XAxis dataKey="openTime" tickFormatter={(ts) => format(new Date(ts), 'MMM d')} stroke={theme.palette.text.secondary} />
                            <YAxis domain={['dataMin - 20', 'dataMax + 20']} stroke={theme.palette.text.secondary} tickFormatter={formatAxisCurrency}/>
                            <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper }}  labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}/>
                            <Legend />
                            <Area type="monotone" dataKey="close" name="Close Price" stroke={theme.palette.primary.main} strokeWidth={2} fillOpacity={1} fill="url(#colorClose)" />
                            <Line type="monotone" dataKey="sma" name="SMA" stroke={theme.palette.warning.main} dot={false} strokeWidth={2} />
                            <Brush dataKey="openTime" height={30} stroke={theme.palette.primary.main} tickFormatter={(ts) => format(new Date(ts), 'MMM d')} />
                        </ComposedChart>
                    </ResponsiveContainer>

                    <Typography variant="h6" sx={{ mt: 2 }}>RSI (14)</Typography>
                    <ResponsiveContainer width="100%" height={100}>
                        <BarChart data={data.dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3" />
                            <XAxis dataKey="openTime" tickFormatter={(ts) => format(new Date(ts), 'MMM d')} stroke={theme.palette.text.secondary} />
                            <YAxis domain={[0, 100]} stroke={theme.palette.text.secondary}  tickFormatter={formatAxisCurrency} width={80}/>
                            <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper }}  labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}/>
                            <Legend />
                            <Line type="monotone" dataKey={() => 70} stroke={theme.palette.error.main} strokeDasharray="5 5" dot={false} name="Overbought" />
                            <Line type="monotone" dataKey={() => 30} stroke={theme.palette.success.main} strokeDasharray="5 5" dot={false} name="Oversold" />
                            <Bar dataKey="rsi" name="RSI" fill={theme.palette.text.secondary} />
                        </BarChart>
                    </ResponsiveContainer>
                </>
            ) : (
                <Box sx={{ mt: 4 }}>
              <Typography variant="h6">Daily Close Price Trend</Typography>
              <ResponsiveContainer width="100%" height={200}>
      
                <ComposedChart
                  data={data.dailyData} 
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="openTime"
                    tickFormatter={(ts) => format(new Date(ts), 'd')}
                    fontSize={12}
                    stroke={theme.palette.text.secondary}
                  />
                  <YAxis
                    fontSize={12}
                    stroke={theme.palette.text.secondary}
                    width={80}
                    domain={['dataMin - (dataMax - dataMin) * 0.1', 'dataMax + (dataMax - dataMin) * 0.1']}
                     tickFormatter={formatAxisCurrency}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}
                    labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                  />
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={false}
                  />
                   <Brush dataKey="openTime" height={30} stroke={theme.palette.primary.main} tickFormatter={(ts) => format(new Date(ts), 'd')} />
                </ComposedChart>
              </ResponsiveContainer>
            </Box>
            )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default DashboardPanel;
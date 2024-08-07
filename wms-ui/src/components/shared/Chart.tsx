import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";






export const  ChartStatistic =(typeChart:any)=>{
    const [chart, setChart] = useState<any>(typeChart.data);
    useEffect(() => {
        setChart(typeChart.data)  
    }, [typeChart])
    
    return (  
      <>
        <ReactApexChart options={chart.options} series={chart.series} type={typeChart.typeChart} height={350} />
      </> 
      
    )

}
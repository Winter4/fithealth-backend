import { ChartConfiguration } from "chart.js";
import { ChartCallback, ChartJSNodeCanvas } from "chartjs-node-canvas";

function getConfig(
  label: string,
  data: number[],
  scales?: { min: number; max: number }
): ChartConfiguration {
  return {
    type: "line",
    data: {
      labels: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь"],
      datasets: [
        {
          label,
          data,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: scales,
      },
    },
    plugins: [
      {
        id: "background-colour",
        beforeDraw: (chart) => {
          const ctx = chart.ctx;
          ctx.save();
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, 400, 400);
          ctx.restore();
        },
      },
    ],
  };
}

export async function getChartStream() {
  const width = 400;
  const height = 400;

  const followPercentConfig = getConfig(
    "Процент следования норме калорий",
    [93.8, 91.2, 97.7, 105.12, 103.1, 96.3],
    { min: 50, max: 150 }
  );

  const dailyLimitConfig = getConfig(
    "Дневная норма калорий",
    [2631, 2573, 2401, 2302, 2267, 2232]
  );

  const chartCallback: ChartCallback = (ChartJS) => {
    ChartJS.defaults.responsive = true;
    ChartJS.defaults.maintainAspectRatio = false;
  };
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });
  return {
    followPercent: await chartJSNodeCanvas.renderToStream(followPercentConfig),
    dailyLimitConfig: await chartJSNodeCanvas.renderToStream(dailyLimitConfig),
  };
}

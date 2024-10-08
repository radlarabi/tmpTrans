export const Chart = (width) => {
    return `
    <div class="chart-container" style="width:${width}%">
        <div class="chart-title">Win Rate</div>
        <canvas id="chart" width="240" height="240" ></canvas>
        
        <div class="chart-keys">
            <div class="chart-legend-item">
                <div class="chart-legend-color" style="background-color: #FF6384;"></div>
                <div class="chart-legend-text">Win</div>
            </div>
            <div class="chart-legend-item">
                <div class="chart-legend-color" style="background-color: #36A2EB;"></div>
                <div class="chart-legend-text">Lose</div>
            </div>
            <div class="chart-legend-item">
                <div class="chart-legend-color" style="background-color: #FFCE56;"></div>
                <div class="chart-legend-text">Draw</div>
            </div>
        </div>
    </div>
    `
}
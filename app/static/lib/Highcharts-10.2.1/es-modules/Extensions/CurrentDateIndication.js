/* *
 *
 *  (c) 2016-2021 Highsoft AS
 *
 *  Author: Lars A. V. Cabrera
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Axis from '../Core/Axis/Axis.js';
import PlotLineOrBand from '../Core/Axis/PlotLineOrBand/PlotLineOrBand.js';
import U from '../Core/Utilities.js';
var addEvent = U.addEvent, merge = U.merge, wrap = U.wrap;
/**
 * Show an indicator on the axis for the current date and time. Can be a
 * boolean or a configuration object similar to
 * [xAxis.plotLines](#xAxis.plotLines).
 *
 * @sample gantt/current-date-indicator/demo
 *         Current date indicator enabled
 * @sample gantt/current-date-indicator/object-app
 *         Current date indicator with custom options
 *
 * @declare   Highcharts.CurrentDateIndicatorOptions
 * @type      {boolean|CurrentDateIndicatorOptions}
 * @default   true
 * @extends   xAxis.plotLines
 * @excluding value
 * @product   gantt
 * @apioption xAxis.currentDateIndicator
 */
var defaultOptions = {
    color: "#ccd6eb" /* Palette.highlightColor20 */,
    width: 2,
    /**
     * @declare Highcharts.AxisCurrentDateIndicatorLabelOptions
     */
    label: {
        /**
         * Format of the label. This options is passed as the fist argument to
         * [dateFormat](/class-reference/Highcharts.Time#dateFormat) function.
         *
         * @type      {string}
         * @default   %a, %b %d %Y, %H:%M
         * @product   gantt
         * @apioption xAxis.currentDateIndicator.label.format
         */
        format: '%a, %b %d %Y, %H:%M',
        formatter: function (value, format) {
            return this.axis.chart.time.dateFormat(format || '', value);
        },
        rotation: 0,
        /**
         * @type {Highcharts.CSSObject}
         */
        style: {
            /** @internal */
            fontSize: '10px'
        }
    }
};
/* eslint-disable no-invalid-this */
addEvent(Axis, 'afterSetOptions', function () {
    var options = this.options, cdiOptions = options.currentDateIndicator;
    if (cdiOptions) {
        var plotLineOptions = typeof cdiOptions === 'object' ?
            merge(defaultOptions, cdiOptions) :
            merge(defaultOptions);
        plotLineOptions.value = Date.now();
        plotLineOptions.className = 'highcharts-current-date-indicator';
        if (!options.plotLines) {
            options.plotLines = [];
        }
        options.plotLines.push(plotLineOptions);
    }
});
addEvent(PlotLineOrBand, 'render', function () {
    // If the label already exists, update its text
    if (this.label) {
        this.label.attr({
            text: this.getLabelText(this.options.label)
        });
    }
});
wrap(PlotLineOrBand.prototype, 'getLabelText', function (defaultMethod, defaultLabelOptions) {
    var options = this.options;
    if (options &&
        options.className &&
        options.className.indexOf('highcharts-current-date-indicator') !== -1 &&
        options.label &&
        typeof options.label.formatter === 'function') {
        options.value = Date.now();
        return options.label.formatter
            .call(this, options.value, options.label.format);
    }
    return defaultMethod.call(this, defaultLabelOptions);
});

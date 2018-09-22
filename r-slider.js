//// r-slider.js//////
function slider(config) {
    var a = {
        buttonTemplate: "",
        fixed: 1,
        state: {},
        init: function (obj) {
            this.setState(obj);
            this.validateState();
            this.updateState();
            this.update();
        },
        setState: function (obj) {
            for (var prop in obj) {
                this.state[prop] = obj[prop];
            }
        },
        validateState: function () {
            var obj = this.state;
            if (obj.switchMode === true) {return;}
            if (obj.start === undefined) { alert("start is not defined"); return false; }
            if (obj.end === undefined) { alert("end is not defined"); return false; }
            if (obj.start > obj.end) { alert("start is greater than end"); return false; }
            if (obj.container === undefined) { alert("container is not defined"); return false; }
            if ($(obj.container) === undefined) { alert("$(container) is not defined"); return false; }
        },
        updateState: function () {
            var obj = this.state;
            if (obj.switchMode === true) {
                obj.start = 0;
                obj.end = 1;
                obj.step = 1;
                if (typeof obj.value !== "boolean") {obj.value = [0];}
                else if (obj.value === false) {obj.value = [0];}
                else {obj.value = [1];}
            }

            this.state.range = obj.end - obj.start;
            if (obj.step === undefined) { this.state.step = 1; }
            if (obj.min === undefined || obj.min < obj.start) { this.state.min = obj.start; }
            if (obj.max === undefined || obj.max > obj.end) { this.state.max = obj.end; }
            if (obj.value === undefined) { obj.value = [obj.min]; }
            if (typeof obj.value === "number") { this.state.value = [obj.value]; }
            for (var i = 0; i < obj.value.length; i++) {
                if (obj.value[i] > obj.max) { this.state.value[i] = obj.max; }
                if (obj.value[i] < obj.min) { this.state.value[i] = obj.min; }
            }
            this.state.style = this.getStyle(obj.style);
            if (this.state.style.button_border) {
                var border = this.state.style.button_border;
                var index1 = border.indexOf(" ");
                var index2 = border.lastIndexOf(" ");
                this.state.style.button_border_width = parseInt(border.slice(0, index1 - 2));
                this.state.style.button_border_color = border.slice(index2 + 1, border.length);
            }
            this.state.text = this.state.text || [];
            var styleName = {};
            if (this.state.vertical) {
                styleName.Thickness = "height"; styleName.Thickness_r = "width";
                styleName.OtherSide = "left"; styleName.OtherSide_r = "right"; styleName.Axis = "y";
                if (this.state.reverse) { styleName.Sign = -1; styleName.StartSide = "bottom"; styleName.EndSide = "top"; }
                else { styleName.Sign = 1; styleName.StartSide = "top"; styleName.EndSide = "bottom"; }
            }
            else {
                styleName.Thickness = "width"; styleName.Thickness_r = "height";
                styleName.OtherSide = "top"; styleName.OtherSide_r = "bottom"; styleName.Axis = "x";
                if (this.state.reverse) { styleName.Sign = -1; styleName.StartSide = "right"; styleName.EndSide = "left"; }
                else { styleName.Sign = 1; styleName.StartSide = "left"; styleName.EndSide = "right"; }
            }
            this.state.styleName = styleName;
            if (this.state.style["button_" + this.state.styleName.Thickness] > $(this.state.container)[this.state.styleName.Thickness]()) {
                this.state.style["button_" + this.state.styleName.Thickness] = $(this.state.container)[this.state.styleName.Thickness]()
            }
        },
        update: function () {
            var container = $(this.state.container);
            container.html("");
            var str = '';
            str += '<div class="r-slider-container" style="' + this.getcontainerstyle() + '">';
            if (Array.isArray(this.state.pinArray) && this.state.pinArray.length !== 0) {
                str += Pins({
                    start: this.state.start,
                    range: this.state.range,
                    step: this.state.step,
                    pinArray: this.state.pinArray,
                    style: this.state.style,
                    styleName: this.state.styleName,
                });
            }
            if (this.state.labelGap) {
                str += Labels({
                    start: this.state.start,
                    step: this.state.step,
                    range: this.state.range,
                    style: this.state.style,
                    styleName: this.state.styleName,
                    labelGap: this.state.labelGap
                });
            }
            str += Line({ style: this.state.style, styleName: this.state.styleName });
            var length = this.state.value.length;
            for (var i = 0; i < length; i++) {
                if (this.state.showFill !== false) {
                    if (this.state.value.length === 1 || i !== 0) {
                        str += Fill({
                            style: this.state.style,
                            index: i,
                            styleName: this.state.styleName,
                            value: this.state.value,
                            range: this.state.range,
                            start:this.state.start,
                        });
                    }
                }
                str += Space({
                    index: i,
                    value: this.state.value,
                    style: this.state.style,
                    styleName: this.state.styleName,
                    text: this.state.text,
                    range: this.state.range,
                    start: this.state.start,
                    vertical : this.state.vertical,
                });
                if(this.state.changable!== false){
                    str += Button({
                        index: i,
                        value: this.state.value,
                        style: this.state.style,
                        styleName: this.state.styleName,
                        range: this.state.range,
                        start: this.state.start,
                        fixNumber: this.state.fixNumber,
                        showNumber:this.state.showNumber
                    });
                }
            }
            str += Space({
                index: length,
                value: this.state.value,
                style: this.state.style,
                styleName: this.state.styleName,
                text: this.state.text,
                start: this.state.start,
                range:this.state.range
            });
            str += '</div>';
            container.html(str);
            if(this.state.changable !== false){
                container.find(".r-slider-button,.r-slider-space").bind("mousedown", $.proxy(this.mousedown, this));
            }
        },
        getStyle: function (obj) {
            var style = {
                button_width: 10,
                button_height: 10,
                line_width: 2,
                button_border_width: 0,
                button_border_color: "#000",
                button_border: "",
                margin: 0,
            }
            if (obj === undefined) { return style; }
            for (prop in obj) { style[prop] = obj[prop]; }
            return style;
        },
        getValueByClick: function (e) {
            var calc = new RSliderCalculator(this.state);
            var inner = $(this.state.container).find(".r-slider-container");
            if (this.state.vertical) {
                if (this.state.reverse) { var distance = inner.offset().top + this.height - e.clientY - pageYOffset; }
                else { var distance = e.clientY + pageYOffset - inner.offset().top; }
            }
            else {
                if (this.state.reverse) { var distance = inner.offset().left + this.width - e.clientX - pageXOffset; }
                else { var distance = e.clientX + pageXOffset - inner.offset().left; }
            }
            return calc.getCorrectValue(calc.getValueByPixel(distance));
        },
        move: function (dir) {
            var buttons = $(this.state.container).find(".r-slider-button");
            for (var i = 0; i < this.state.value.length; i++) {
                this.moveButtonTo(buttons.eq(i), this.state.step * dir, true);
            }
            if (this.state.ondrag !== undefined) { this.state.ondrag({ values: this.state.value }); }
        },
        setValue:function(value){
            if(!Array.isArray(value)){value = [value];}
            for(var i = 0; i < value.length; i++){
                if(value[i] > this.state.max){value[i] = this.state.max;}
                if(value[i] < this.state.min){value[i] = this.state.min;}
            }
            this.state.value = value;
            this.update();
        },
        getValue:function(){
            return this.state.value;
        },
        mousedown: function (e) {
            e.preventDefault();
            var container = $(this.state.container);
            var element = $(e.currentTarget);
            var clickMode = element.attr("class");
            var index = element.data("index");
            if (this.state.switchMode === true) {
                if (this.state.value[0] === 0) {
                    this.move(1);
                }
                else {
                    this.move(-1);
                }
            }
            else if (index === 0 && clickMode === "r-slider-space") { this.move(-1); } //اگر روی فضای خالی ابتدا کلیک شد
            else if (index === this.state.value.length) { this.move(1); }//اگر روی فضای خالی انتها کلیک شد
            else {
                var container = $(this.state.container);
                var button = container.find(".r-slider-button[data-index=" + index + "]");
                var button_b = container.find(".r-slider-button[data-index=" + (index - 1) + "]");
                var value = this.state.value[index];
                var value_b = this.state.value[index - 1];
                this.setWidthHeight();
                this.state.startOffset = {
                    x: e.clientX, y: e.clientY,
                    value: value,
                    value_b: value_b,
                    button: button,
                    button_b: button_b,
                    clickMode: clickMode,
                    index: index,
                };
                if (clickMode === "r-slider-space") { this.state.startOffset.diffrence = Math.abs(value - value_b); }
                $(window).bind("mousemove", $.proxy(this.mousemove, this));
            }
            container.find(".r-slider-number").show();
            $(window).bind("mouseup", $.proxy(this.mouseup, this));
        },
        mousemove: function (e) {
            var calc = new RSliderCalculator(this.state);
            var so = this.state.startOffset, index = so.index, axis = this.state.styleName.Axis;
            var change;
            var offset = (e["client" + axis.toUpperCase()] - so[axis]) * this.state.styleName.Sign;
            var offsetValue = calc.getValueByPixel(offset);
            if (so.clickMode === "r-slider-space") {
                var value = calc.getCorrectValue(offsetValue + so.value);
                var value_b = calc.getCorrectValue(offsetValue + so.value_b);
                if (index > 1 && value_b < this.state.value[index - 2]) { value_b = this.state.value[index - 2]; value = value_b + so.diffrence; }
                if (index < this.state.value.length - 1 && value > this.state.value[index + 1]) { value = this.state.value[index + 1]; value_b = value - so.diffrence; }
                if (this.state.value[index - 1] === this.state.min && value < this.state.value[index]) { value = this.state.min + so.diffrence; }
                if (this.state.value[index] === this.state.max && value_b > this.state.value[index - 1]) { value_b = this.state.max - so.diffrence; }
                change = this.moveButtonTo(so.button, value, false);
                this.moveButtonTo(so.button_b, value_b, false);
            }
            else {
                var value = calc.getCorrectValue(offsetValue + so.value);
                change = this.moveButtonTo(so.button, value, false);
            }
            if (this.state.ondrag !== undefined && change) { this.state.ondrag({ values: this.state.value }); }
        },
        mouseup: function () {
            if (this.state.fixNumber !== true) { $(".r-slider-number").fadeOut(100); }
            $(window).unbind("mousemove", $.proxy(this.mousemove, this)).unbind("mouseup", $.proxy(this.mouseup, this));
            if (this.state.onchange !== undefined) { this.state.onchange({ values: this.state.value }); }
        },
        setWidthHeight: function () {
            var inner = $(this.state.container).find(".r-slider-container");
            this.state.width = inner.width(); this.state.height = inner.height();
        },
        moveButtonTo: function (button, value, offset) {
            var calc = new RSliderCalculator(this.state);
            if (offset === true) { if (value === 0) { return false; } value += parseFloat(button.attr("data-value")); }
            value = calc.getCorrectValue(value);
            if (parseFloat(button.attr("data-value")) === value) { return false };
            var index = button.data("index");
            if (index > 0 && value < this.state.value[index - 1]) { return false; }
            if (index < this.state.value.length - 1 && value > this.state.value[index + 1]) { return false; }
            var sn = this.state.styleName;
            var percent = calc.getPercentByValue(value);
            var percent_b = calc.getPercentByValue(this.state.value[index - 1]) || 0;
            var percent_a = calc.getPercentByValue(this.state.value[index + 1]) || 100;
            var container = $(this.state.container);
            var fill = container.find(".r-slider-fill[data-index=" + (index) + "]");
            var fill_a = container.find(".r-slider-fill[data-index=" + (index + 1) + "]");
            var space = container.find(".r-slider-space[data-index=" + (index) + "]");
            var space_a = container.find(".r-slider-space[data-index=" + (index + 1) + "]");
            var style = this.state.style;
            var size = style['button_' + sn.Thickness];
            button.css(sn.StartSide, 'calc(' + percent + '% - ' + (size / 2 + style.button_border_width) + 'px');
            fill.css(sn.Thickness, (percent - percent_b) + '%');
            fill_a.css(sn.Thickness, (percent_a - percent) + '%');
            fill_a.css(sn.StartSide, percent + '%');
            space.css(sn.Thickness, (percent - percent_b) + '%');
            space_a.css(sn.Thickness, (percent_a - percent) + '%');
            space_a.css(sn.StartSide, percent + '%');
            this.state.value[index] = value;
            button.attr("data-value", value);
            button.find(".r-slider-number").html(value);
            return true;
        },
        /////////get template////////////////////
        getcontainerstyle: function () {
            var sn = this.state.styleName;
            var style = this.state.style;
            var size = style['button_' + sn.Thickness];
            var size_r = style['button_' + sn.Thickness_r];
            var str = 'position:absolute;';
            //str += 'background:red;opacity:0.3;';
            str += sn.StartSide + ':' + ((size / 2) + style.button_border_width + style.margin) + 'px;';
            str += sn.OtherSide + ':calc(50% - ' + (size_r / 2 + style.button_border_width) + 'px);';
            str += sn.Thickness + ':calc(100% - ' + (size + (style.button_border_width * 2) + (style.margin * 2)) + 'px);';
            str += sn.Thickness_r + ':' + (size_r + (style.button_border_width * 2)) + 'px;';
            return str;
        },
        
        
        
    }
    a.init(config);
    return a;
}
function RSliderCalculator(obj) {
    var a = {
        state:{},
        init:function(obj){
            for (prop in obj) { this.state[prop] = obj[prop]; }
        },
        getPercentByValue: function (value) {
            if (value === undefined) { return undefined; }
            return 100 * (value - this.state.start) / (this.state.range) || 0;
        },
        getPercentByPixel: function (px) { return Math.round(px * 100 / this.state[this.state.styleName.Thickness]); },
        getValueByPercent: function (percent) { return ((this.state.range / 100) * percent) + this.state.start; },
        getValueByPixel: function (px) { return (px * this.state.range) / this.state[this.state.styleName.Thickness]; },
        getCorrectValue: function (value) {
            value = (Math.round((value - this.state.start) / this.state.step) * this.state.step) + this.state.start;
            if (value < this.state.min) { value = this.state.min; }
            else if (value > this.state.max) { value = this.state.max; }
            value = parseFloat(value.toFixed(2));
            return value;
        },
    }
    a.init(obj);
    return a;
}

function Pins(obj) {
    var start = obj.start;
    var range = obj.range;
    var step = obj.step;
    var pinArray = obj.pinArray;
    var style = obj.style;
    var styleName = obj.styleName;

    var str = '';
    for (var i = 0; i <= range / step; i += 1) {
        str += Pin({
            start: start,
            step: step,
            style: style,
            styleName: styleName,
            pinArray: pinArray,
            index: i,
            range: range
        });
    }
    return str;
}
function Pin(obj) {
    var style = obj.style;
    var pinArray = obj.pinArray;
    var step = obj.step;
    var start = obj.start;
    var sn = obj.styleName;
    var index = obj.index;
    var range = obj.range;

    var calc = new RSliderCalculator({ start: start, range: range });
    var percent = calc.getPercentByValue(index * step + start);
    function getStyle() {
        var sstr = '';
        sstr += 'position:absolute;';
        if (pinArray[0] !== undefined && index % pinArray[0] === 0) {
            sstr += sn.OtherSide + ':0;';
            sstr += sn.Thickness_r + ':100%;';
        }
        else if (pinArray[1] !== undefined && index % pinArray[1] === 0) {
            sstr += sn.OtherSide + ':25%;';
            sstr += sn.Thickness_r + ':50%;';
        }
        sstr += sn.Thickness + ':1px;';
        sstr += sn.StartSide + ':' + percent + '%;';
        return sstr;
    }

    var str = '';
    str += '<div class="r-slider-pin" style="' + getStyle() + '"></div>';
    return str;
}
function Labels(obj) {
    var labelGap = obj.labelGap;
    var start = obj.start;
    var step = obj.step;
    var styleName = obj.styleName;
    var style = obj.style;
    var range = obj.range;

    var str = '';
    for (var i = 0; i <= range / step; i += labelGap) {
        str += Label({ start: start, step: step, styleName: styleName, style: style, index: i, range: range });
    }
    return str;
}
function Label(obj) {
    var style = obj.style;
    var step = obj.step;
    var start = obj.start;
    var sn = obj.styleName;
    var index = obj.index;
    var range = obj.range;

    var calc = new RSliderCalculator({ start: start, range: range });
    var percent = calc.getPercentByValue(index * step + start)
    function getStyle() {
        var size = style['button_' + sn.Thickness];
        var sstr = 'position: absolute;line-height: 2px;text-align: center;';
        sstr += sn.Thickness + ': 40px;';
        sstr += sn.Thickness_r + ':2px;';
        sstr += sn.StartSide + ':calc(' + percent + '% - 20px);';
        return sstr;
    }
    var str = '';
    str += '<div class="r-slider-label" style="' + getStyle() + '"><span>';
    str += index * step + start;
    str += '</span></div>';
    return str;
}
function Fill(obj) {
    var style = obj.style;
    var index = obj.index;
    var sn = obj.styleName;
    var value = obj.value;
    var range = obj.range;
    var start = obj.start;

    var calc = new RSliderCalculator({ start: start, range: range });
    var percent = calc.getPercentByValue(value[index]);
    var beforePercent = (index === 0) ? 0 : calc.getPercentByValue(value[index - 1]);
    function getStyle() {
        var str = 'position: absolute;z-index: 10;cursor: pointer;';
        str += sn.Thickness + ':' + (percent - beforePercent) + '%;';
        str += sn.StartSide + ':' + beforePercent + '%;';
        str += sn.OtherSide + ':calc(50% - ' + (style.line_width / 2) + 'px);';
        str += sn.Thickness_r + ':' + style.line_width + 'px;'
        return str;
    }
    var str = '<div ';
    str += 'data-index="' + index + '" ';
    str += 'class="r-slider-fill" ';
    str += 'style="' + getStyle() + '"';
    str += '>';
    str += '</div>';
    return str;
}

function Space(obj) {
    var index = obj.index;
    var value = obj.value;
    var style = obj.style;
    var sn = obj.styleName;
    var text = obj.text;
    var range = obj.range;
    var start = obj.start;
    var vertical = obj.vertical;

    var calc = new RSliderCalculator({ start: start, range: range });
    var percent = calc.getPercentByValue(value[index]);
    if (percent === undefined) { percent = 100; }//for end space
    var beforePercent = (index === 0) ? 0 : calc.getPercentByValue(value[index - 1]);
    function getStyle() {
        var sstr = 'position:absolute;z-index:100;overflow: hidden;cursor:pointer;';
        sstr += sn.Thickness + ':' + (percent - beforePercent) + '%;';
        sstr += sn.StartSide + ':' + beforePercent + '%;';
        sstr += sn.OtherSide + ':0;';
        sstr += sn.Thickness_r + ':100%;';
        return sstr;
    }
    var str = '';
    str += '<div ';
    str += 'data-index="' + index + '" ';
    str += 'class="r-slider-space" ';
    str += 'style="' + getStyle() + '"';
    str += '>';
    if (!vertical) {
        str += this.Text({
            index: index,
            value: value,
            style: style,
            styleName: sn,
            text: text
        });
    }
    str += '</div>';
    return str;
}
function Text(obj) {
    var style = obj.style;
    var value = obj.value;
    var text = obj.text
    var sn = obj.styleName;
    var index = obj.index;

    var length = value.length;
    function getStyle() {
        var size = style['button_' + sn.Thickness];
        var tstr = '';
        if (index === 0) {
            tstr += sn.Thickness + ':calc(100% - ' + size / 2 + 'px);';
            tstr += sn.StartSide + ':0;';
            tstr += sn.OtherSide + ':0;';
        }
        else if (index === length) {
            tstr += sn.Thickness + ':calc(100% - ' + size / 2 + 'px);';
            tstr += sn.EndSide + ':0;';
            tstr += sn.OtherSide + ':0;';
        }
        else {
            tstr += sn.Thickness + ':100%;';
        }
        tstr += 'line-height:' + style.button_height + 'px;';
        return tstr;
    }
    var str = '';
    str += '<div ';
    str += 'data-index="' + index + '" ';
    str += 'class="r-slider-text" ';
    str += 'style="' + getStyle() + '"';
    str += '>';
    str += text[index] || "";
    str += '</div>';
    return str;
}

function Line(obj) {
    var style = obj.style;
    var sn = obj.styleName;
    function getStyle() {
        var str = 'position:absolute;z-index:1;';
        str += sn.Thickness + ':100%;';
        str += sn.StartSide + ':0;';
        str += sn.OtherSide + ':calc(50% - ' + (style.line_width / 2) + 'px);';
        str += sn.Thickness_r + ':' + style.line_width + 'px;'
        return str;
    }
    return '<div class="r-slider-line" style="' + getStyle() + '"></div>';
}


function Button(obj) {
    var value = obj.value;
    var style = obj.style;
    var sn = obj.styleName;
    var index = obj.index;
    var fixNumber = obj.fixNumber;
    var showNumber = obj.showNumber;
    var range = obj.range;
    var start = obj.start;

    var calc = new RSliderCalculator({ start: start, range: range });
    var percent = calc.getPercentByValue(value[index]);
    function getStyle() {
        var size = style['button_' + sn.Thickness];
        var str = '';
        str += 'border:none;position:absolute;z-index: 1000;cursor:pointer;';
        str += 'height:' + style.button_height + 'px;';
        str += 'width:' + style.button_width + 'px;';
        str += sn.StartSide + ':calc(' + percent + '% - ' + (size / 2 + style.button_border_width) + 'px);';
        str += sn.OtherSide + ':0;';
        return str;
    }
    var str = '<div ';
    str += 'data-index="' + index + '" ';
    str += 'data-value="' + value[index] + '" ';
    str += 'class="r-slider-button" ';
    str += 'style="' + getStyle() + '"';
    str += '>';
    if (showNumber) {
        str += Number({
            style: style,
            value: value,
            fixNumber: sn,
            index: index,
        });
    }
    str += '</div>';
    return str;
}
function Number(obj) {
    var style = obj.style;
    var value = obj.value;
    var fixNumber = obj.fixNumber;
    var index = obj.index;

    function getStyle() {
        var size = style.button_height;
        var sstr = 'position: absolute;z-index: 1000;';
        if (fixNumber !== true) { sstr += 'display:none;'; }
        return sstr;
    }
    var str = '';
    str += '<div ';
    str += 'data-index="' + index + '" ';
    str += 'style="' + getStyle() + '" ';
    str += 'class="r-slider-number" ';
    str += '>';
    str += value[index];
    str += '</div>';
    return str;
}
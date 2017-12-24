/*! ***************************************************************************
 *
 * evolutility-ui-jquery :: one-mini.js
 *
 * View "one mini" to "quick edit" one backbone model (only showing important or required fields).
 *
 * https://github.com/evoluteur/evolutility-ui-jquery
 * (c) 2017 Olivier Giulieri
 *
 *************************************************************************** */

Evol.ViewOne.Mini = function(){

    var dom = Evol.DOM,
        fts = Evol.Def.fieldTypes;

return Evol.ViewOne.Edit.extend({

    events: { // TODO same as ViewOne ?
        'click > .evol-buttons > button': 'click_button',
        'click .evol-title-toggle': 'click_toggle',
        //'click .glyphicon-wrench': 'click_customize',
        'click label > .glyphicon-question-sign': 'click_help'
    },

    viewName: 'mini',
    icon: 'th-large', // glyphicon-th-large
    prefix: 'om',

    fieldsetFilter: function(f){
        return (f.required || f.inMany || f.inMini);// && f.type!='formula';
    },

    _render: function (h, mode) {
        // TODO browse mode
        // in EDIT and BROWSE modes
        var miniUIModel= {
            id: 'p-mini',
            type: 'panel',
            class: 'evol-mini-holder',
            label: Evol.Format.capitalize(this.uiModel.name),
            width: 100,
            elements: this.getFields()
        };
        
        this._renderPanel(h, miniUIModel, mode);
        this._renderButtons(h, mode);
    },

    _renderPanel: function (h, p, mode, visible) {
        var that = this,
            iconsPath = this.iconsPath;
            
        h.push('<div data-p-width="100%" class="evol-pnl evol-p-mini">'+
            dom.panelBegin(p, this.style, true)+
            '<fieldset data-pid="'+p.id+(p.readonly?'" disabled>':'">'));
        _.each(p.elements, function (elem) {
            if(elem.type==fts.hidden){
                h.push(dom.input.hidden(that.fieldViewId(elem.id), that.getModelFieldValue(elem.id, elem.defaultValue, mode)));
            }else{
                h.push('<div class="pull-left evol-fld w-100">'+
                    '<div class="evol-mini-label">'+Evol.Dico.HTMLFieldLabel(elem, mode)+
                    '</div><div class="evol-mini-content">');
                that.renderField(h, elem, mode, iconsPath, true);
                h.push("</div></div>");
            }
        });
        h.push('</fieldset>'+
            dom.panelEnd()+
            '</div>');
        return this;
    }

});

}();

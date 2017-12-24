/*! ***************************************************************************
 *
 * evolutility-ui-jquery :: one-browse.js
 *
 * View "one browse" to browse one model in readonly mode.
 *
 * https://github.com/evoluteur/evolutility-ui-jquery
 * (c) 2017 Olivier Giulieri
 *
 *************************************************************************** */

Evol.ViewOne.Browse = Evol.View_One.extend({

    viewName: 'browse',
    editable: false,
    icon: 'eye-open', // glyphicon-eye-open
    prefix: 'ovw',

    getData: function () {
        // TODO make JSON obj w/ model limited to fields in uimodel?
        return {};
    },

    setData: function (model) {
        if(!_.isUndefined(model) && model!==null){
            var that=this,
                uii=Evol.DOM.input,
                fts = Evol.Def.fieldTypes,
                fieldHTML_ReadOnly = Evol.Dico.fieldHTML_RO,
                $f, fv,
                prefix='#'+ that.prefix + '-',
                subCollecs=this.getSubCollecs(),
                iconsPath=this.iconsPath||'';
            _.each(this.getFields(), function (f) {
                $f=that.$(prefix + f.id);
                if(f.value){
                    fv=f.value(model);
                }else{
                    fv=model.get(f.attribute || f.id);
                }
                if(model){
                    switch(f.type){
                        case fts.lov:
                        case fts.list:
                        case fts.bool:
                        case fts.email:
                        case fts.url:
                        case fts.html:
                            $f.html(fieldHTML_ReadOnly(f, fv, Evol.hashLov, iconsPath));
                            break;
                        case fts.formula:
                            $f.html(f.formula?f.formula(model):'');
                            break;
                        case fts.pix:
                            $f.html((fv)?('<img src="'+iconsPath+fv+'" class="img-thumbnail">'):('<p>'+Evol.i18n.nopix+'</p>'));
                            break;
                        case fts.color:
                            $f.html(uii.colorBox(f.id, fv, fv));
                            break;
                        case fts.textml:
                            if(fv){
                                $f.html(_.escape(fv).replace(/[\r\n]/g, '<br>'));
                            }else{
                                $f.html('');
                            }
                            break;
                        case fts.json:
                            $f.val(Evol.Format.jsonString(fv, false));
                            break;
                        default:
                            $f.text(fieldHTML_ReadOnly(f, fv, Evol.hashLov, iconsPath) || ' ');
                    }
                }
            });
            if(subCollecs){
                _.each(subCollecs, function (sc) {
                    var h=[];
                    that._renderPanelListBody(h, sc, fv, 'browse');
                    that.$('[data-pid="'+sc.id+'"] tbody')
                        .html(h.join(''));
                });
            }
        }
        return this.setTitle();
    },

    clear: function () {
        var that=this,
            $f,
            fts = Evol.Def.fieldTypes,
            prefix='#'+ that.prefix + '-',
            subCollecs=this.getSubCollecs();

        this.clearMessages();
        _.each(this.getFields(), function (f) {
            $f=that.$(prefix + f.id);
            switch(f.type) {
                case fts.bool:
                    $f.prop('checked', f.defaultValue?'checked':false);
                    break;
                case fts.pix:
                    // TODO

                    break;
                default:
                    $f.html(f.defaultValue || '');
            }
        });
        if(subCollecs){
            _.each(subCollecs, function (sc) {
                that.$('[data-pid="'+sc.id+'"] tbody')
                    .html(that._TRnodata(sc.elements.length, 'browse'));
            });
        }
        return this;
    },

    _renderButtons: function (h) {
        h.push(Evol.DOM.html.clearer+
            '<div class="evol-buttons panel '+this.style+'">'+
            Evol.DOM.button('cancel', Evol.i18n.tools.bCancel, 'btn-default')+
            Evol.DOM.button('edit', Evol.i18n.tools.bEdit, 'btn-primary')+
            '</div>');
    }

});

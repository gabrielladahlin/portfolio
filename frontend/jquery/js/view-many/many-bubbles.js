/*! ***************************************************************************
 *
 * evolutility-ui-jquery :: many-bubbles.js
 *
 * View "many bubbles" to show a Bubble Chart of a collection of many models.
 *
 * https://github.com/evoluteur/evolutility-ui-jquery
 * (c) 2017 Olivier Giulieri
 *
 *************************************************************************** */

Evol.ViewMany.Bubbles = Evol.View_Many.extend({

    viewName: 'bubbles',
    icon: 'adjust', // glyphicon-adjust

    events: {
        //'click .evol-buttons>button': 'click_button',
        //'click .evol-title-toggle': 'click_toggle',
        //'click .glyphicon-wrench': 'click_customize',
        'click .btn': 'clickGroup',
        'change .bubble-group': 'changeGroup',
        'change .bubble-color': 'changeColor',
        'change .bubble-size': 'changeSize',
        'click svg>circle': 'clickCircle'
    },

    fieldsetFilter: Evol.Def.fieldChartable,

    setupBubbles: function() {
        var that=this,
            ui=this.uiModel,
            models = this.collection.models;

        if(!this._bubblesInitialized){
            var flds = Evol.Def.getFields(this.uiModel, Evol.Def.fieldChartable),
                fd=flds.length?flds[0].id:null;
            this.bubbles = new Evol.Bubbles({
                //selector:'.evol-bubbles-body',
                elem: this.$('.evol-bubbles-body').get(0),
                width:1200, 
                height:700, 
                fields: flds,
                colorFieldId: fd,
                groupFieldId: fd,
                sizeFieldId: null,
                uiModel: this.uiModel,
                tooltip: function(d){
                    var h=[],
                    flds=that.getFields();
                    Evol.ViewMany.Cards.prototype.HTMLItem.call(that, h, flds, new Backbone.Model(d), null, null, null, true);
                    return h.join('');
                }
            });
            this.bubbles.setData(_.map(models, function(m){
                return _.extend({
                    id: m.id
                }, m.attributes);
            }));

            this._bubblesInitialized=true;
        }
    },

    _render: function (models) {
        var dom = Evol.DOM,
            i18nTools = Evol.i18n.tools,
            hOpt = dom.input.option,
            hOptNull = dom.html.emptyOption,
            fo,
            fs2 = Evol.Def.getFields(this.uiModel, Evol.Def.fieldChartable),
            h = '<div class="evol-many-bubbles panel '+this.style+'"><div class="evol-bubbles-body">'+
                '<div class="d3-tooltip" style="opacity:0;"></div>';
        //h+=this._HTMLbody(this.getFields(), pSize, this.uiModel.icon, 0, this.selectable);

        h+='<div class="bubbles-opts '+this.style+'">';
        if(fs2.length){
            // --- Group ---
            h+='<label>'+i18nTools.vizGroupBy+': </label>';
            if(fs2.length>5){
                fo=_.map(fs2, function(f, idx){
                        return hOpt(f.id, f.label, idx===0);
                    });
                h+='<select class="form-control bubble-group">'+hOptNull + fo.join('')+'</select>';
            }else{
                h+='<div class="btn-group" data-toggle="buttons">'+
                _.map(fs2, function(f, idx){
                    if(_.isUndefined(f.groupable) || f.groupable){
                        return '<label class="btn btn-default'+(idx===0?' active':'')+'" id="'+f.id+'">'+
                              '<input type="radio" name="options"'+(idx===0?' checked':'')+'>'+f.label+'</label>';
                    }
                }).join('')+
                '</div>';
            }
            // --- Color ---
            fo=_.map(fs2, function(f, idx){
                    return (_.isUndefined(f.colorable) || f.colorable) ? hOpt(f.id, f.label, idx===0) : '';
                });
            h+='<label>'+i18nTools.vizColorBy+': </label><select class="form-control bubble-color">'+hOptNull + fo.join('')+'</select>';
            // --- Size ---
            fs2=_.filter(fs2, function(f){
                return (_.isUndefined(f.sizable) || f.sizable) ? Evol.Def.fieldIsNumber(f) : '';
            });
            fo=_.map(fs2, function(f, idx){
                return hOpt(f.id, f.label);
            });
            if(fo.length){
                h+='<label>'+i18nTools.vizSizeBy+': </label><select class="form-control bubble-size">'+hOptNull+fo.join('')+'</select>';
            }
            //h+=dom.html.clearer;
        }else{
            h+=Evol.i18n.notEnoughdata;
        }
        h+='</div></div></div>';
        this.$el.html(h);
        this.setupBubbles();
        return this;
    },

    _HTMLbody: function(){

    },

    _HTMLlegend: function(){
        // todo
    },

    _$body: function(){
        return this.$('.evol-bubbles-body');
    },

    setCollection: function(collec){
        this.collection = collec;
        this.bubbles.setData(_.map(collec.models, function(m){
            return _.extend({
                id: m.id
            }, m.attributes);
        }));
        return this;
    },

    clickGroup: function(evt){
        this.bubbles.changeBubblesGroup(evt.currentTarget.id);
    },
    changeGroup: function(evt){
        this.bubbles.changeBubblesGroup(evt.target.value);
    },

    changeColor: function(evt){
        this.bubbles.changeBubblesColor(evt.target.value);
    },

    changeSize: function(evt){
        this.bubbles.changeBubblesSize(evt.target.value);
    },

    clickCircle: function(evt){
        var id=$(evt.currentTarget).data('mid');
        this.$el.trigger('click.bubble', {id:id});
        window.location.href = '#'+ this.uiModel.id + '/browse/'+id;
    }

});


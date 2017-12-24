/*! ***************************************************************************
 *
 * evolutility-ui-jquery :: dico.js
 *
 * Library of helpers for dictionary
 *
 * https://github.com/evoluteur/evolutility-ui-jquery
 * (c) 2017 Olivier Giulieri
 *
 *************************************************************************** */

var Evol = Evol || {};

// not a "virtual DOM" but an "abstract DOM"
Evol.Dico = function(){

    var dom = Evol.DOM,
        uiInput = dom.input,
        i18n = Evol.i18n,
        fts = Evol.Def.fieldTypes;

return {

    fieldEdit: {

        field: function (f, fType, fid, fv) {
            return uiInput[fType](fid, fv, f, null);
        },

        default: function (f, fid, fv) {
            return uiInput.text(fid, fv, f, null);
        },

        text: function (f, fid, fv) {
            return uiInput.text(fid, fv, f, null);
        },
        textmultiline: function (f, fid, fv) {
            // fv = _.escape(fv);
            if (f.height === null) {
                f.height = 5;
            } else {
                var fHeight = parseInt(f.height, 10);
                if (fHeight < 1) {
                    f.height = 5;
                }
            }
            return uiInput.textM(fid, fv, f.maxlength, f.height);
        },

        boolean: function (f, fid, fv) {
            return uiInput.checkbox(fid, fv);
        },
        integer: function (f, fid, fv) {
            return uiInput.textInt(fid, fv, f.max, f.min);
        },
        decimal: function (f, fid, fv) {
            //todo
            return uiInput.textInt(fid, fv, f.max, f.min);
        },
        money: function (f, fid, fv) {
            return '<div class="input-group evol-money">'+uiInput.typeFlag('$')+
                uiInput.textInt(fid, fv, f.max, f.min)+'</div>';
        },

        date: function (f, fid, fv) {
            return uiInput.date(fid, fv);
        },
        datetime: function (f, fid, fv) {
            return uiInput.dateTime(fid, fv);
        },
        time: function (f, fid, fv) {
            return uiInput.time(fid, fv);
        },
/*
        geoloc: function (f, fid, fv) {
            return uiInput.geoloc(fid, fv);
        },
*/
        lov: function (f, fid, fv) {
            return uiInput.select(fid, fv, '', true, f.list);
        },
        list: function (f, fid, fv) { // fv is an array. will use select2
            return '<div id="'+fid+'" class="w-100 form-control"></div>';
        },

        email: function (f, fid, fv) {
            return '<div class="input-group">'+uiInput.typeFlag(i18n.msg.sgn_email)+
                uiInput.text(fid, fv, f)+
                '</div>';
        },
        url: function (f, fid, fv) {
            return uiInput.text(fid, fv, f);
            //fv!==''?EvoUI.link(fid,'',fv):''
        },
        //doc: function(f, fid, fv, iconsPath){
        //},
        image: function(f, fid, fv, iconsPath){
            var h='';
            if(fv!==''){
                h+='<img src="'+((fv.substr(0, 2)==='..')?fv:iconsPath + fv)+'" class="img-thumbnail">';
            }else{
                h+='<p class="">'+i18n.nopix+'</p>';
            }
            h+=uiInput.text(fid, fv, f, null);
            return h;
        },
        color: function(f, fid, fv){
            return uiInput.color(fid, fv);
        },
        hidden: function(f, fid, fv){
            return uiInput.hidden(fid, fv);
        },
        html: function (f, fid, fv) {
            // TODO
            return uiInput.textM(fid, fv, f.maxlength, f.height);
        },
        json: function(f, fid, fv){
            // TODO
            return uiInput.textM(fid, fv, f.maxlength, f.height);
        },
        formula: function(f, fid, fv){
            return '<div class="evol-ellipsis">'+uiInput.text(fid, fv, f, null)+'</div>';
        }
    },

    fieldHTML: function(fld, fid, fv, mode, iconsPath, skipLabel){
        var h='';
        function emHeight(f){
            var fh = parseInt(f.height || 2, 10);
            if(fh<2){
                fh=2;
            }
            return parseInt(fh*1.6, 10);
        }
        // --- field label ---
        if(!skipLabel){
            h+=this.HTMLFieldLabel(fld, mode || 'edit');
        }
        // --- field value ---
        if(fld.readonly || mode==='browse'){
            h+='<div class="disabled evo-rdonly'+(fld.type===fts.email || fld.type===fts.url?' evol-ellipsis':'')+'" id="'+fid;
            if(fld.type===fts.textml && fld.height>1){
                h+='" style="height:'+emHeight(fld)+'em;overflow-y: auto;';
            }
            h+='">';
            switch (fld.type) {
                case fts.formula:
                    // TODO: in one.js or here?
                    h+='<div id="'+fid+'" class="form-control evol-ellipsis">'+fld.formula()+'</div>';
                    break;
                case fts.color: // TODO is the color switch necessary?
                    h+='<div id="'+fid+'" class="form-control">'+uiInput.colorBox(fid, fv)+'</div>';
                    break;
                default:
                    h+=this.fieldHTML_RO(fld, fv, {}, iconsPath);
            }
            h+='&nbsp;</div>';
        }else{
            var ftc=Evol.Dico.fieldEdit[fld.type];
            if(!ftc){
                ftc=Evol.Dico.fieldEdit.default;
            }
            h+=ftc(fld, fid, fv, iconsPath);
        }
        return h;
    },

    fieldHTML_RO: function(f, v, hashLov, iconsPath, wId){
        switch(f.type){
            case fts.bool:
                if (v==='true' || v=='1') {
                    return dom.icon('ok', f.css);
                }
                break;
            case fts.lov:
                if (v !== '') {
                    return Evol.Dico.lovItemText(f, v, hashLov, iconsPath);
                }
                break;
            case fts.list:
                if(_.isString(v) && v!==''){
                    v = v.split(',');
                }
                if(v && v.length && v[0]!==''){
                    return '<div class="evo-f-list"><div>'+_.map(v, function(vi){
                        return Evol.Dico.lovItemText(f, vi, hashLov, iconsPath);
                    }).join('</div><div>')+'</div></div>';
                }
                return '';
            case fts.date:
            case fts.time:
            case fts.datetime:
                return Evol.Format[f.type+'String'](v);
            case fts.pix:
                if (v && v.length) {
                    //return uiInput.img(f.id, (v.substr(0, 2)==='..')?v:iconsPath + v, 'img-thumbnail');
                    return uiInput.img(f.id, iconsPath + v, 'img-thumbnail');
                }
                break;
            case fts.money:
                var nv=parseFloat(v);
                if (!isNaN(nv)) {
                    return '$'+nv.toFixed(2);
                }
                break;
            case fts.email:
                return dom.linkEmail(wId?f.id:null, v);
            case fts.url:
                return dom.link(f.id, v, v, f.id);
            case fts.json:
                return dom.input.textM(f.id, Evol.Format.jsonString(v, false), f.maxLen, f.height, true);
            //case fts.color:
            //    return uiInput.colorBox(f.id, v, v);
            default:
                return v;
        }
        return '';
    },

    HTMLFieldLabel: function (fld, mode) {
        var h='<div class="evol-field-label" id="'+fld.id+'-lbl"><label class="control-label '+(fld.cssLabel?fld.cssLabel:'')+'" for="'+fld.id+'">'+fld.label;
        if (mode != 'browse' && fld.required){
            h+=dom.html.required;
        }
        if (fld.help && fld.help!==''){
            h+=dom.icon('question-sign', '');
        }
        h+='</label></div>';
        return h;
    },

    fieldLink: function (id, fld, value, icon, noLink, route) {
        var h='';
        if(!noLink){
            var js='javascript'; // necessary for jshint
            h+='<a href="'+(route?route:(js+':void(0);'));
            if(id){
                h+='" id="'+id;
            }
            h+='" class="evol-nav-id">';
        }
        if(icon){
            h+='<img class="evol-many-icon" src="'+icon+'">';
        }/*
         if(_.isUndefined(value) || value===''){
         value='('+model.id+')';
         }*/
        h+='<span>'+value+'</span>';
        if(!noLink){
            h+='</a>';
        }
        return h;
    },

    clearCacheLOV: function(){
        Evol.hashLov={};
    },

    setViewTitle: function(that, title, badge){
        if(that.titleSelector){
            $(that.titleSelector)
                .html(
                    (that.icon?'<i class="glyphicon glyphicon-'+that.icon+'"></i>&nbsp;':'')+
                    (title?title:that.getTitle())+
                    (badge?'<span class="badge badge-one">'+badge+'</span>':'')
                );
        }
        return that;
    },

    getFieldVal:function(f, $f){
        switch(f.type) {
            case fts.bool:
                return $f.prop('checked');
            case fts.int:
                return parseInt($f.val(), 10);
            case fts.dec:
            case fts.money:
                return parseFloat($f.val());
            case fts.list:
                try{
                    return $f.select2('val');
                }catch(e){
                    console.error('error with select2');
                    //alert('error with select2')
                    return '';
                }
                break;
            case fts.date:
                var d=$f.val();
                if(d.length===10){
                    d+='T08:00:00.000Z';
                }
                return d;
            default:
                return $f.val();
        }
    },
    // get field value (not id but text) for a field of type lov
    lovItemText:function(f, v, hash, iconsPath, inDiv){
        if(f.list && f.list.length>0 && hash){
            if(!(f.id in hash)){
                hash[f.id]={};
            }
            var hashLov = hash[f.id];
            if(v in hashLov){
                return hashLov[v];
            }else{
                var listItem=_.find(f.list, function(item){
                    return item.id==v;
                });
                if(listItem){
                    var txt= _.escape(listItem.text);
                    if(listItem.glyphicon){
                        txt='<i class="glyphicon glyphicon-'+listItem.glyphicon+'"></i> '+txt;
                    }else if(listItem.icon){
                        txt='<img src="'+((listItem.icon && listItem.icon.substring(0,1)!=='.')?iconsPath:'')+listItem.icon+'"> '+txt;
                    }
                    hashLov[v]=txt;
                    return txt;
                }
            }
        }
        return '';
    },

    lovItemTextNoPix:function(f, v){
        var listItem=_.find(f.list, function(item){
            return item.id==v;
        });
        if(listItem){
            return listItem.text;
        }
        return '';
    },
/*
    showDesigner: function(id, type, $el, context){
         var css='evodico-'+type,
             //$('<div class="evodico-'+type+'"></div>'),
             model,
             uiModel=context.uiModel,
             f;
         //context.getFields(dico_field_ui);
         switch(type){
             case 'object':
                 //TODO
                 break;
             case 'field':
                 uiModel = uiModels.field;
                 f=context.getFieldsHash(uiModel)[id];
                 model = new Backbone.Model(f);
                 break;
             //case 'list':
             //case 'tab':
             case 'panel':
             //case 'panel-list':
                 uiModel = uiModels.panel;
                 f=context.uiModel.elements[0]; //TODO
                 model = new Backbone.Model(f);
                 break;
         }
         //$el.closest('.evol-fld').after($elDesModal);
         $('body').append($elDesModal);
         var $elDesModal=$(dom.modal.HTMLModal('m'+id, 'Edit '+type+' '+ f.label, '<div class="'+css+'"></div>')),
         $elDes=$elDesModal.find('.'+css);
         var vw = new Evol.ViewOne.Edit({
             uiModel: uiModel,
             model: model,
             defaultView: 'edit',
             el: $elDes,
             style:'panel-primary',
             size:'S',
             button_addAnother: false
         }).render();

         $elDes.on('click', 'button#save,button#cancel', function(evt){
             //TODO save field => dependency: uiModel persistence...
             $elDesModal.modal('hide').remove();
         });

         $elDesModal.modal('show');

         return this;
     },

    uiModel2tdbTable: function(uiModel){
        // -- generates SQL script to create a Postgress DB table for the object
        var t=uiModel.id || uiModel.name;
        var fields=Evol.Def.getFields(uiModel);
        var sql='CREATE TABLE '+t;
        sql+='\n(\n';
        sql+=[' id serial NOT NULL,\n'];
        _.forEach(fields, function(f, idx){
            sql+=' "'+(f.attribute || f.id)+'" ';
            switch(f.type){
                case 'boolean':
                case 'integer':
                    sql+=f.type;
                    break;
                case 'date':
                case 'datetime':
                case 'time': 
                    sql+='date';
                    break;
                default:
                    sql+='text';
            }
            if(f.required){
                sql+=' not null';
            }
            sql+=',\n';
        });
        sql+='CONSTRAINT "'+t+'_pkey" PRIMARY KEY (id)';
        sql+='\n) WITH (OIDS=FALSE);';

        return sql;
    },
*/
    filterModels: function(models, filters){
        if(filters.length){
            var fConds=Evol.Dico.fieldConditions;
            return models.filter(function(model){
                var good=true;
                for(var i=0, iMax=filters.length;i<iMax;i++){
                    var filter=filters[i],
                        vm=model.get(filter.field.value);

                    if(_.isArray(vm)){
                        var ln=vm.length,
                            fGood=false;
                        for(var j=0;j<ln;j++){
                            if(fConds[filter.operator.value](vm[j], filter.value.value)){
                                fGood=true;
                                break;
                            }
                        }
                        if(!fGood){
                            return fGood;
                        }
                    }else{
                        if(_.isUndefined(vm)){
                            vm='';
                        }
                        if(!fConds[filter.operator.value](vm, filter.value.value, filter.value.value2)){
                            return false;
                        }
                    }
                }
                return good;
            });
        }
        return models;
    },

    bbComparator: function(fid){
        return function(modelA) {
            return modelA.get(fid);
        };
    },

    bbComparatorText: function(fid){
        return function(modelA, modelB) {
            return (modelA.get(fid)||'').localeCompare(modelB.get(fid)||'');
        };
    },

    bbComparatorFormula: function(fid, fn){
        return function(modelA, modelB) {
            var mA = fn(modelA),
                mB = fn(modelB);
            if(mA<mB){
                return 1;
            }
            if(mB<mA){
                return -1;
            }
            return 0;
           // return (fn(modelA)||'').localeCompare(fn(modelB)||'');
        };
    },

    sortNumber: function(fid){
        return function(modelA, modelB) {
            if(modelA[fid]<modelB[fid]){
                return 1;
            }
            if(modelB[fid]<modelA[fid]){
                return -1;
            }
            return 0;
        };
    },

    sortText: function(fid){
        return function(modelA, modelB) {
            return (modelA[fid]||'').localeCompare(modelB[fid]||'');
        };
    },

    setPageTitle: function(title){
        if(_.isUndefined(this._$headTitle)){
            this._$headTitle = $('#headTitle');
        }
        this._$headTitle.html(title);
    },

    getItemTitle: function(e){
        return e.find('h4>a>span').text();
    },

    getRoute: function(){
        var cURL=window.location.href,
            idx=cURL.indexOf('#');
        return (idx>-1)?cURL.substr(idx+1):'';
    },

    setRoute: function(router, entity, view, opts, trigger){
        if(!_.isUndefined(router)){
            var route = entity + '/' + view;
            if(opts){
                route+='/' + opts;
            }
            if(route!==this.getRoute()){
                router.navigate('#' + route, {trigger: trigger});
            }
        }
    },

    // -- list of operator and function for filters
    fieldConditions: {
        // filter functions take parameters fv=fieldValue, cv=condition value, cv2
        // -- equals
        'eq': function(fv, cv){
            return cv==fv;
        },
        // -- not equal
        'ne': function(fv, cv){
            return cv!=fv;
        },
        // -- > or after
        'gt': function(fv, cv){
            return fv>cv;
        },
        // -- < or before
        'lt': function(fv, cv){
            return fv<cv;
        },
        // -- between
        'bw': function(fv, cv, cv2){
            return !(cv>fv || fv>cv2);
        },
        // -- start w/
        'sw': function(fv, cv){
            return fv.substring(0, cv.length).toLocaleLowerCase()===cv;
        },
        // -- contains
        'ct': function(fv, cv){
            if(fv){
                return fv.toLocaleLowerCase().indexOf(cv)>-1;
            }
            return false;
        },
        // -- doesn't contains
        'nct': function(fv, cv){
            if(fv){
                return fv.toLocaleLowerCase().indexOf(cv)===-1;
            }
            return true;
        },
        // -- finish w/
        'fw': function(fv, cv){
            var l1=fv.length,
                l2=cv.length;
            if (l1<l2){
                return false;
            }else{
                return fv.toLocaleLowerCase().substring(l1-l2)===cv;
            }
        },
        // -- empty
        'null': function(fv, cv){
            return  fv==='' || _.isUndefined(fv);
        },
        // -- not null
        'nn': function(fv, cv){
            return !(_.isUndefined(fv) || fv==='');
        },
        // -- in []
        'in': function(fv, cv){
            if(_.isArray(fv)){
                var cvs=cv.split(',');
                for(var i=0;i<fv.length;i++){
                    if(_.contains(cvs, fv[i])){
                        return true;
                    }
                }
                return false;
            }else{
                return _.contains(cv.split(','), fv);
            }
        },
        // -- true
        '1': function(fv, cv){
            return fv;
        },
        // -- false
        '0': function(fv, cv){
            return !fv;
        }
    }

};

}();

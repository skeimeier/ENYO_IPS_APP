enyo.kind({
	name: "App",
    kind: "Panels",
    fit: true,
    classes: "app-panels",
    arrangerKind: "CollapsingArranger",
	components: [
       {name: "MyStartPanel", 	kind: "FittableRows",	classes: "enyo-fit", components: [
			{kind: "onyx.Toolbar",  components: [
				{kind: "onyx.Grabber"},
				{content: "IPS Suche ..."},
				{name: "spinner", kind: "onyx.Spinner", classes: "onyx-dark", showing: false}
			]},
			{kind: "FittableColumns", classes:"onyx-toolbar-inline", components: [
				{content: "Objects: "},
				{kind: "onyx.Input",  name:"query", placeholder: "Suche eingeben..", fit:true, style: "hight:35px",  value:'', onchange:"fetch" }, 
				{kind: "onyx.Button", ontap:"fetchObjectList", components: [
				    {kind: "onyx.Icon", src: "assets/search-input-search.png"},
					{content: "Suchen.."}
				]}
			]},
			{kind: "onyx.Toolbar", components:[		
				{content: "IP-Symcon"}, 
				{ kind: "enyo.Image", name: "logo", src: "assets/favicon.ico" }
			]},	
			{kind: "enyo.Scroller", name: "ipsRoot", fit: true, components: [
				{tag:"div", name: "ipsTitel", fit:true, classes: "title"},
				{name: "main", classes: "nice-padding", allowHtml: true}
			]},
			{kind: "onyx.Toolbar", components: [
				{kind: "onyx.Button", content: "Root lesen", ontap: "fetchRoot"},
				{kind: "onyx.Button", content: "Children lesen", ontap: "fetchChildren"},
				{kind: "onyx.Button", content: "Back", ontap: "listLevel1Categorien", disabled: false}
			]},
			/*
			{kind: "Scroller", thumb: true, fit:true,  components: [
				{name: "filmListe", kind: "Repeater",  onSetupItem:"setupItem", components: [
					{name:"filmItem", classes:"repeater-sample-item", ontap: "itemTap", components: [
						{kind: "FittableColumns",   components: [
							{tag:"img", name: "filmImg", src:"", classes : "repeater-poster-klein"  },
							{kind: "FittableRows",  fit:true,  components: [
							
								{  name: "filmNumber" },
								{ name: "filmJahr"},
							
								{ name: "filmName" , classes: "title"}
							]},
							
							{name: "filmMarker",tag:"img", src:"assets/marker.ico", classes: "rechtsbuendig" }
						]}
					]}
				]}
			]}
			*/
		]},
        {name: "MyMiddlePanel", kind: "FittableRows",	classes: "enyo-fit", components: [
			{kind: "onyx.Toolbar", name: "details",  components: [ 
				{kind: "onyx.Grabber"},
				{content: "Film Details"}
			]},
			{name: "FilmDetails", 	kind: "Scroller", components: [
			    {kind: "onyx.Item", components: [
					{tag:"div", name: "childCount",content: "Kinderzahl:",fit:true},
					{tag: "br"},
				]}	
			]},
			{name: "Tree", 	kind: "Scroller", fit:true, components: [
				{kind: "Node", name: "root", icon: "assets/folder-open.png", content: "Root", onNodeTap: "showNode",
					expandable: true, expanded: true, components: [
						{icon: "assets/file.png", content: "Alpha"},
						{icon: "assets/folder-open.png", content: "Bravo",
							expandable: true, expanded: false, components: [
								{icon: "assets/file.png", content: "Bravo-Alpha"},
								{icon: "assets/file.png", content: "Bravo-Bravo"},
								{icon: "assets/file.png", content: "Bravo-Charlie"}
							]
						}
					]
				}
			]}
		]},
        {name: "MyLastPanel", classes: "enyo-fit", components: [
			{kind: "onyx.Toolbar",  components: [ 
				{kind: "onyx.Grabber"},
				{content: "Film Poster"}
			]},
			{tag:"img", name: "filmPoster", src:"", classes: "panel-poster" },
		]}
 
    ],
	ips_objectList:[],
	ips_objects:[],
	ips_opjTypes: ["Kategorie","Instanz","Variable","Skript","Ereignis","Media","Link"],
	childCount:0, 
	
	nodeExpand: function(inSender, inEvent) {
		inSender.setIcon("assets/" + (inSender.expanded ? "folder-open.png" : "folder.png"));
	},
	nodeTap: function(inSender, inEvent) {
		var node = inEvent.originator;
		this.$.selection.select(node.id, node);
	},
	select: function(inSender, inEvent) {
		inEvent.data.$.caption.applyStyle("background-color", "lightblue");
	},
	deselect: function(inSender, inEvent) {
		inEvent.data.$.caption.applyStyle("background-color", null);
	},

	fetchRoot: function() {    
		var apiKey = 'd95d1f942d3f7bb15d036eb9e13b0182';
		var jsonp = new enyo.Ajax({
			//http://imdbapi.org/?title=moon&type=jsonp&plot=simple&episode=0&limit=10&yg=0&mt=none&lang=en-US&offset=&aka=simple&release=simple&business=0&tech=0
			//url: "http://query.yahooapis.com/v1/public/yql?format=json", 
			//url: "http://imdbapi.org/",
		    url: "http://192.168.115.22:81/json-rpc.php",
			method: "POST",
			postBody: '{"jsonrpc":"2.0","method":"IPS_GetObject","params":[0],"id":"1"}'

		});
		// send parameters the remote service using the 'go()' method
		jsonp.response(this, "ipsSuccess");
		jsonp.error(this, "ipsFailure");
		jsonp.go(jsonp.postBody		);
		// attach responders to the transaction object
		this.$.spinner.start();
	},
	fetchObject: function( ID ){
		var apiKey = 'd95d1f942d3f7bb15d036eb9e13b0182';
		var jsonp = new enyo.Ajax({
			//http://imdbapi.org/?title=moon&type=jsonp&plot=simple&episode=0&limit=10&yg=0&mt=none&lang=en-US&offset=&aka=simple&release=simple&business=0&tech=0
			//url: "http://query.yahooapis.com/v1/public/yql?format=json", 
			//url: "http://imdbapi.org/",
		    url: "http://192.168.115.22:81/json-rpc.php",
			method: "POST",
		});

		jsonp.postBody = '{"jsonrpc":"2.0","method":"IPS_GetObject","params":['+ ID + '],"id":"10"}';
        jsonp.response(this, "ipsSuccess");
		jsonp.error(this, "ipsFailure");
		jsonp.go(jsonp.postBody		);
	
	},
	fetchChildren: function() {    
		this.ips_objects.sort(function(a, b){ return a.ObjectID - b.ObjectID; }); 
		if(this.ips_objects.length > 0 &&  this.ips_objects[0].ObjectID == 0){
			var childIDs = 	this.ips_objects[0].ChildrenIDs;
			this.childCount = childIDs.length + 1;
			for( objID in childIDs){
				this.fetchObject(childIDs[objID]);
			}
		}
	},
	fetchObjectList: function(){
		var jsonp = new enyo.Ajax({
		    url: "http://192.168.115.22:81/json-rpc.php",
			method: "POST",
		});
				jsonp.postBody = '{"jsonrpc":"2.0","method":"IPS_GetObjectList","params":[],"id":"20"}';
        jsonp.response(this, "ipsSuccess");
		jsonp.error(this, "ipsFailure");
		jsonp.go(jsonp.postBody		);

	},
	ipsSuccess: function(inSender, inResponse) {
		enyo.log("got success from ipsJson:", inResponse);
		if(inResponse.error !== undefined){
			this.showDialog(inResponse.error);		
		}
		if(inResponse.id === "1"){
			var ipsobj = inResponse.result;
			enyo.log("got success from ipsJson:", ipsobj.ObjectName);
			this.ips_objects.push(ipsobj);
			this.results = ipsobj.ChildrenIDs;
			this.$.ipsTitel.setContent(ipsobj.ObjectName);
			
			this.$.main.setContent(ipsobj.ObjectName + "<BR>");
			for(name in ipsobj){
				if( typeof ipsobj[name] !== 'function'){ 
					if( name === "ObjectType" ){
						this.$.main.addContent(name + " : " + this.ips_opjTypes[ipsobj[name]]+ "<BR>");
					}else{
					this.$.main.addContent(name + " : " + ipsobj[name]+ "<BR>");
					//this.ipsTestForObj(ipsobj[name]);
					//if( typeof ipsobj[name] == 'object'){
					//	var xobj = ipsobj[name];
					//	for(xname in xobj){
					//		if( typeof xobj[name] !== 'function'){  
					//			this.$.ipsshow.addContent(">    " + xname + " : " + xobj[xname]+ "<BR>");
					//		}
					//	}
					//}	
					// */
					}
				}
			}
			this.$.spinner.stop();

		}
		if(inResponse.id == "10"){
			
			
			this.ips_objects.push(JSON.parse(JSON.stringify(inResponse.result)));
								this.$.main.addContent( " : " + inResponse.result.ObjectID + "<BR>");

			this.$.childCount.setContent("Kinderzahl: "+this.ips_objects.length + " of total "+ this.childCount );
		}
		if(inResponse.id == "20"){
			this.ips_objectList = inResponse.result;
			for(n in this.ips_objectList){
				this.fetchObject(this.ips_objectList[n]);
			}
			//this.$.main.addContent( " : " + inResponse.result.ObjectID + "<BR>");
			//this.$.childCount.setContent("Kinderzahl: "+this.ips_objects.length + " of total "+ this.childCount );
		}
		if(inResponse.id === "105"){
			var ipsobj = inResponse.result*6.25;
			this.$.WZSlider.setPosition(ipsobj);
		}
		if(inResponse.id === "106"){
			var ipsobj = inResponse.result;
			this.$.ToggleSchrankwand.setState(ipsobj);
		}
		if(inResponse.id === "101"){
			var ipsobj = inResponse.result;
			this.$.ToggleGlasvitriene.setState(ipsobj);
		}
		if(inResponse.id === "111"){
			var ipsobj = inResponse.result;
			this.$.ipsButton.setDisabled(false);
		}
		
	},
	ipsFailure: function() {
		enyo.log("got failure from ipsJson");
		this.$.spinner.stop();

	},
	listLevel1Categorien: function(){
		var obj;
		var liste=[];

		for( var i = 1; i < this.ips_objects.length; i++){
			obj = this.ips_objects[i];
			if( obj.ObjectType == 0 && obj.ParentID == 0 ){
				if(obj.HasChildren){
					var ex = [];
					for( var j = 0; j < obj.ChildrenIDs.length; j++){
						ex.push( {icon: "assets/file.png", content: obj.ChildrenIDs[j], ID: obj.ChildrenIDs[j]} );
					}
					
				}
				liste.push(	{   icon:  obj.HasChildren ? "assets/folder.png" : "assets/file.png",
                				content: obj.ObjectName,
								expandable: obj.HasChildren ? true : false, 
								expanded: false, 
								components: obj.HasChildren ? ex : [],
								pos: obj.ObjectPosition,
								ID: obj.ObjectID
				} );
			}

		}
		liste.sort(function(a, b){ return a.pos - b.pos; } ); 
		this.$.root.addNodes(	liste );
		//this.$.root.render();

	},
	showNode: function(inSender, inEvent) {
		this.nodeTap(inSender, inEvent);
		enyo.log("node was tapped");
		var objNo = inEvent.originator.ID;
		//var n = this.ipsObjects.indexOf(
		for(obj in this.ips_objects){
			if(objNo == this.ips_objects[obj].ObjectID){
				var ipsobj = this.ips_objects[obj];	
					break;
			}
		}
		if(ipsobj !== undefined){
		
			this.$.main.setContent("");
			for(name in ipsobj){
				if( typeof ipsobj[name] !== 'function'){ 
					if( name === "ObjectType" ){
						this.$.main.addContent(name + " : " + this.ips_opjTypes[ipsobj[name]]+ "<BR>");
					}else{
					this.$.main.addContent(name + " : " + ipsobj[name]+ "<BR>");
					//this.ipsTestForObj(ipsobj[name]);
					//if( typeof ipsobj[name] == 'object'){
					//	var xobj = ipsobj[name];
					//	for(xname in xobj){
					//		if( typeof xobj[name] !== 'function'){  
					//			this.$.ipsshow.addContent(">    " + xname + " : " + xobj[xname]+ "<BR>");
					//		}
					//	}
					//}	
					// */
					}
				}
			}
		}else{
			this.fetchObject(objNo);
		}
	},
	helloWorldTap: function(inSender, inEvent) {
		//this.$.main.addContent("The button was tapped.<br/>");
		//this.fetch();
	}
});

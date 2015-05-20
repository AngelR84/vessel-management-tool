
var InfocardTransforms =  {
		
		editToModel: function( /*EDIT*/ itemEdit, /*MODEL*/ infocard)
		{
			const recursive = function( /*EDIT*/ myitemEdit, /*MODEL*/ itemModel){
				itemModel.title = myitemEdit.title;
			    itemModel.slogan = myitemEdit.slogan;
			    itemModel.description = myitemEdit.description;
				itemModel.type = myitemEdit.type;
				itemModel.urlImg = myitemEdit.urlImg;
				itemModel.urlPage = myitemEdit.urlPage;
				itemModel.price = myitemEdit.price;
				itemModel.deal = myitemEdit.deal;
				itemModel.urlImgIcon = myitemEdit.urlImgIcon;
				

				if(myitemEdit.type == 'PRODUCT'){
					itemModel.slideList = [];
					myitemEdit.listslideimg.forEach(function(slide){
							var obj = new SlideModel();
							obj.init({});
							obj.type = slide.type;
							obj.src = slide.src;
							itemModel.addSlideToList(obj);
					});
				}
				
				if(myitemEdit.type == 'MENU')
						for(var i = 0; i < myitemEdit.items.length; i++){
								var item = new InfocardItemModel();
								item.init({});
								recursive(myitemEdit.items[i], item);
								itemModel.addItemToList(item);
						};
			};
			
			var item = new InfocardItemModel();
			item.init({});
			recursive(itemEdit,item);
			infocard.infocardItem = item;
		},
		
		
	  modelToEdit : function(/*MODEL*/ infocard, /*EDIT*/ itemEdit)
		 {
				const recursive = function(/*MODEL*/itemModel ,/*EDIT*/ newItemEdit){
					newItemEdit.title = itemModel.title;
					newItemEdit.slogan = itemModel.slogan;
					newItemEdit.description = itemModel.description;
					newItemEdit.type = itemModel.type;
					newItemEdit.urlImg = itemModel.urlImg;
					newItemEdit.urlPage = itemModel.urlPage;
					newItemEdit.price = itemModel.price;
					newItemEdit.deal = itemModel.deal;
					newItemEdit.urlImgIcon = itemModel.urlImgIcon;
					
					if(itemModel.type == 'PRODUCT'){
						console.log("ver");
						console.log(newItemEdit.listslideimg);
						newItemEdit.listslideimg = itemModel.getSlideList();
						console.log("Lista Actualizada");
						console.log(newItemEdit.listslideimg);
					}
					
					if(itemModel.type == 'MENU'){
							var list = itemModel.itemsList;
							list.forEach(function(myItemModel){
								var myItemEdit = new InfocardItem();
								recursive(myItemModel, myItemEdit);
								newItemEdit.addItem(myItemEdit);
							});
					}
					console.log(newItemEdit);
				};
				
			recursive(infocard.infocardItem,itemEdit);
		}
};
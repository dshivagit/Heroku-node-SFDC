/*NOTE: All response from API Call will contain the following structure
/*
    {
        "status": "success",=====> will contain either 'success' or 'failure'
        "code": 200,======> status code Ex:404,500,200
        "data": {},====>>requested data
        "error": ""====>>if any errors
    }
*/


/*Global Variables Section*/

//Declare your Global Variables inside this block
var editId = null;
var products = [];
var categories = [];
var filtercategories = [];

/*End of Global Variables*/

// A $(document).ready() block.
$(document).ready(function () {

    //Write any code you want executed in a $(document).ready() block here

});

//Get List of Products from the database
function getProducts() {

    /***
    Write your code for fetching the list of product from the database
    
    Using AJAX call the webservice http://localhost:3000/products in GET method
    It will return an Array of objects as follows
    
        {
            [
                {
                    "_id" : "57b6fabb977a336f514e73ef",
                    "price" : 200,
                    "description" : "Great pictures make all the difference. That’s why there’s the new Moto G Plus, 4th Gen. It gives you a 16 MP camera with laser focus and a whole lot more, so you can say goodbye to blurry photos and missed shots. Instantly unlock your phone using your unique fingerprint as a passcode. Get up to 6 hours of power in just 15 minutes of charging, along with an all-day battery. And get the speed you need now and in the future with a powerful octa-core processor.",
                    "category" : "Smartphones",
                    "name" : "Moto G Plus, 4th Gen (Black, 32 GB)",
                    "productImg" : {
                    "fileName" : "57b6fabb977a336f514e73ef_Product.png",
                    "filePath" : "./public/images/Product/57b6fabb977a336f514e73ef_Product.png",
                    "fileType" : "png"
                },
                {
                    //Next Product and so on
                }
            ]
        }

    Using jQuery
    Iterate through this response array and dynamically create the products list
    using JavaScript DOM and innerHTML.
    ***/

    $.ajax({
        url: "http://localhost:3000/products", success: function (result) {
            products = result.data;
            getCategories();
            loadProducts(products);
        }
    });
}

function loadProducts(productlist) {
    $("#products").html('');
    $.each(productlist, function (index, item) {
        var description = item.description;
        if (item.description.length > 100) {
            description = item.description.substring(0, 100) + '........';
        }
        $("#products").append('<div class="item  col-xs-4 col-lg-4 list-group-item" id="' + item._id + '">\
            <div class="thumbnail">\
            <div class="col-lg-3">\
                <img class="group list-group-image"  src="images/Product/'+ item.productImg.fileName + '?' + new Date().getTime() + '" alt="" />\
                <p class="uploadLink" onclick="javascript:uploadLinkClik(this);" data-id="' + item._id + '" style="text-align:center"><a ><span class="glyphicon glyphicon-open"></span>Upload</a></p>\
            </div>\
                <div class="caption col-lg-9">\
                    <h4 class="group inner list-group-item-heading">\
                        '+ item.name + '</h4>\
                    <p class="group inner list-group-item-text">\
                        '+ description + '</p>\
                    <label class="list-group-item-category">\
                        '+ item.category + '</label>\
                    <div class="row">\
                        <div class="col-xs-6 col-md-6 col-sm-6">\
                            <p class="lead list-item-price">\
                                RS:'+ item.price + '</p>\
                        </div>\
                    </div>\
            </div >\
            <div class="buttonrow col-lg-12">\
             <button type= "button" class="btn btn-danger" data-id="' + item._id + '">\
            <span class="glyphicon glyphicon-trash" aria-hidden="true" ></span >Remove\
            </button >\
            <button type="button" class="btn btn-success">\
            <span class="glyphicon glyphicon-edit" aria-hidden="true" ></span >Edit\
            </button >\
                        </div >\
        </div>');
    });
}


//Initial call to populate the Products list the first time the page loads
getProducts();


/*
 Write a generic click even capture code block 
 to capture the click events of all the buttons in the HTML page

 If the button is remove
 -----------------------
 Popup an alert message to confirm the delete
 if confirmed
 Call the API
    http://localhost:3000/product/<id>
    with method = DELETE
    replace <id> with the _id in the product object

 Show the success/failure message in a message div with the corresponding color green/red


 If the button is add
 -----------------------
 Using jQuery Validate the form
 All fields are mandatory.
 Call the API
    http://localhost:3000/product
    with method=POST
    For this call data should be in following structure
    {
         name:'',
         category:'',
         description:'',
         price:''
    }

 Show the success/failure messages in a message div with the corresponding color green/red
 Reset the form and set the mode to Add

 
 If the button is edit
 ---------------------
 Change the Form to Edit Mode
 Populate the details of the product in the form
 
 
 If the button is Update
 -----------------------
 Using jQuery Validate the form
 All fields are mandatory.
 Call the API
    http://localhost:3000/product/:id    
    with method=PUT
    replace <id> with the _id in the product object
    For this call data should be in following structure
     {
     name:'',
     category:'',
     description:'',
     price:''
     }

 Show the success/failure messages in a message div with the corresponding color green/red
 Reset the Form
 Set the Form back to Add mode

 if the button is Cancel
 -----------------------
 Reset the form
 Set the mode to Add

 */

//$('#confirm').on('show.bs.modal', function (event) {
//    var button = $(event.currentTarget);
//    var id = button.data('id');
//    console.log(event);
//    var modal = $(this);
//    modal.find('#delete').attr('data-id', id);
//})

$(document).on('click', 'button', function (e) {
   
    if (this.innerText.trim() == 'Remove' && this.id != 'delete') {
        var element = $(this);
        var id = element.closest(".list-group-item").attr('id');
        e.preventDefault();
        $("#confirm").on('show.bs.modal', function (event) {
            modalOpenedby = event.relatedTarget.target;
            var button = $(modalOpenedby);
            var id = button.data('id');
            var modal = $(this);
            modal.find('#delete').data('id', id);
        }).modal('toggle', e)
            .one('click', '#delete', function (e) {
                var id = $(this).data('id');
                removeProduct(id);
                $("#confirm").modal('hide');
                var messagePanel = $("#productsuccessalert");
                messagePanel.text('Successfully Removed');
                messagePanel.removeClass('alert-danger');
                messagePanel.removeClass('hide');
                messagePanel.addClass('alert-success');
                messagePanel.fadeTo(2000, 500).slideUp(500, function () {
                    $("#productsuccessalert").slideUp(500);
                });
            })
    }
    else if (this.innerText.trim() == 'Edit') {
        var element = $(this);
        var id = element.closest(".list-group-item").attr('id');
        editId = id;
        $.ajax({
            url: "http://localhost:3000/product/" + id, success: function (result) {
                $("#name").val(result.data.name);
                $("#category").val(result.data.category);
                $("#description").val(result.data.description);
                $("#price").val(result.data.price);
                var button_element = document.getElementById('submitProduct');
                if (button_element) {
                    document.getElementById('submitProduct').innerText = "Update"
                }
            }
        });

    }
    else if (this.innerText.trim() == 'Add') {
        createProduct();
        return false;
    }
    else if (this.innerText.trim() == 'Update') {
        editProduct(editId);
        return false;
    }
    else if (this.innerText.trim() == 'Cancel') {
        clearForm();
        return false;
    }
});

/*Remove Product*/
function removeProduct(id) {

    //write your code here to remove the product and call when remove button clicked
    $.ajax({
        url: "http://localhost:3000/product/" + id, method: "delete", success: function (result) {
            $("#" + id).fadeOut('slow', function () {
                $("#" + id).remove();
            });

        },
        error: function (error) {
            console.log(error);
        }
    });

}

/*Update Product*/
function editProduct(id) {

    //write your code here to update the product and call when update button clicked
    var name = $("#name").val();
    var category = $("#category").val();
    var description = $("#description").val();
    var price = $("#price").val();
    if (name != "" && category != "" && description != "" && price != "") {
        $.ajax({
            url: "http://localhost:3000/product/" + id,
            method: "put",
            data: { name: name, category: category, description: description, price: price },
            success: function (result) {
                getProducts();
                clearForm();
                var messagePanel = $("#productformalert");
                messagePanel.text('Product successfully saved');
                messagePanel.removeClass('alert-danger');
                messagePanel.removeClass('hide');
                messagePanel.addClass('alert-success');
                messagePanel.fadeTo(2000, 500).slideUp(500, function () {
                    $("#productformalert").slideUp(500);
                });
            }
        });
    }
    else {
        var messagePanel = $("#productformalert");
        messagePanel.text('Please fill all the fields');
        messagePanel.removeClass('alert-success');
        messagePanel.removeClass('hide');
        messagePanel.addClass('alert-danger');
        messagePanel.fadeTo(2000, 500).slideUp(500, function () {
            $("#productformalert").slideUp(500);
        });
    }
}

function createProduct() {
    //write your code here to create  the product and call when add button clicked
    debugger;
    var name = $("#name").val();
    var category = $("#category").val();
    var description = $("#description").val();
    var price = $("#price").val();
    if (name != "" && category != "" && description != "" && price != "") {
        $.ajax({
            url: "http://localhost:3000/product",
            method: "post",
            data: { name: name, category: category, description: description, price: price },
            success: function (result) {
                getProducts();
                clearForm();
                var messagePanel = $("#productformalert");
                messagePanel.text('Product successfully saved');
                messagePanel.removeClass('alert-danger');
                messagePanel.removeClass('hide');
                messagePanel.addClass('alert-success');
                messagePanel.fadeTo(2000, 500).slideUp(500, function () {
                    $("#productformalert").slideUp(500);
                });
            }
        });
    }
    else {
        var messagePanel = $("#productformalert");
        messagePanel.text('Please fill all the fields');
        messagePanel.removeClass('alert-success');
        messagePanel.removeClass('hide');
        messagePanel.addClass('alert-danger');
        messagePanel.fadeTo(2000, 500).slideUp(500, function () {
            $("#productformalert").slideUp(500);
        });
    }


}

function clearForm() {
    $("#name").val('');
    $("#category").val('');
    $("#description").val('');
    $("#price").val('');
    var button_element = document.getElementById('submitProduct');
    if (button_element) {
        document.getElementById('submitProduct').innerText = "Add"
    }
}


/* 
    //Code Block for Drag and Drop Filter

    //Write your code here for making the Category List
    Using jQuery
    From the products list, create a list of unique categories
    Display each category as an individual button, dynamically creating the required HTML Code

    
    //Write your code here for filtering the products list on Drop 
    Using jQuery
    Show the category button with a font-awesome times icon to its right in the filter list
    A category should appear only once in the filter list
    Filter the products list with, products belonging to the selected categories only


    //Write your code to remove a category from the filter list
    Using jQuery
    When the user clicks on the x icon
    Remove the category button from the filter list
    Filter the products list with, products belonging to the selected categories only

 */
$.extend({
    distinct: function (items) {
        var result = [];
        $.each(items, function (i, v) {
            if ($.inArray(v.category, result) == -1) result.push(v.category);
        });
        return result;
    }
});

function getCategories() {
    categories = $.distinct(products);
    $("#allcategories").html('');
    $.each(categories, function (index, item) {
        $("#allcategories").append('<a href="#" draggable="true" ondragstart="dragstart(event)">' + item + ' </a>');
    });
}

function allowDrop(event) {

    if (event.target.className == "category category-filter") {
        event.preventDefault();
    }
}

function drop(event) {

    if (event.target.className == "category category-filter") {
        event.preventDefault();
        var data = event.dataTransfer.getData("Text").trim();
        if (filtercategories.indexOf(data) == -1) {
            filtercategories.push(data);
            $(event.target).append('<a href="#">' + data + '</a><button type="button" class="btn btn-danger btn-circle" onclick="closeCategoryFilter(this);"><i class="glyphicon glyphicon-remove"></i></button>');
        }
        filterProducts();
    }
}

function dragstart(event) {
    event.dataTransfer.setData("Text", event.target.innerText);
}

function closeCategoryFilter(sourceItem) {
    var sourceElem = $(sourceItem);
    var linkElem = $(sourceItem).prev()[0];
    var categoryText = $(linkElem).text();
    var index = filtercategories.indexOf(categoryText);
    if (index > -1) {
        filtercategories.splice(index, 1);
        $(sourceElem).remove();
        $($(linkElem)).remove();
    }
    filterProducts();
}

function filterProducts() {
    var filteredProductList = [];
    var searchText = $("#searchText").val();
    $.each(products, function (index, item) {
        if ((searchText == "" || item.name.indexOf(searchText) > -1 || item.category.indexOf(searchText) > -1 || item.description.indexOf(searchText) > -1) && (filtercategories.length == 0 || filtercategories.indexOf(item.category) > -1)) {
            filteredProductList.push(item);
        }
    });
    loadProducts(filteredProductList)
}


//Code block for Free Text Search
$(document).ready(function () {
    $("#searchText").keyup(function () {
        /*
            //Write your code here for the Free Text Search
            When the user types text in the search input box. 
            As he types the text filter the products list
            Matching the following fields
                - Name
                - Description
                - Category
                - Price
            
            The search string maybe present in any one of the fields
            anywhere in the content

         */
        filterProducts();
    });


});


//Code block for Image Upload

/*
    //Write your Code here for the Image Upload Feature
    Make the product image clickable in the getProducts() method.
    When the user clicks on the product image
    Open the file selector window
    Display the selected image as a preview in the product tile
    
    //Image Upload
    When the user clicks Upload
    Using AJAX
    Update the product image using the following api call
        Call the api
            http://localhost:3000/product/id/ProductImg
            method=PUT
            the data for this call should be as FormData
            eg:
            var formData = new FormData();
            formData.append('file', file, file.name);
    
    Refresh the products list to show the new image
 */


document.getElementById('upload').addEventListener('change', function () {
    var file = this.files[0];
    console.log("name : " + file.name);
    console.log("size : " + file.size);
    console.log("type : " + file.type);
    console.log("date : " + file.lastModified);
    var id = $(this).data('id');
    console.log("id : " + id);
    var data = new FormData();
    data.append('file', file, file.name);
    $.ajax({
        url: "http://localhost:3000/product/" + id + "/ProductImg",
        method: "put",
        data: data,
        processData: false,
        contentType: false,
        enctype: 'multipart/form-data',
        success: function (result) {
            getProducts();
            var messagePanel = $("#productsuccessalert");
            messagePanel.text('Image uploaded successfully');
            messagePanel.removeClass('alert-danger');
            messagePanel.removeClass('hide');
            messagePanel.addClass('alert-success');
            messagePanel.fadeTo(2000, 500).slideUp(500, function () {
                $("#productsuccessalert").slideUp(500);
            });
        },
        error: function (error) {
            console.log(error);
            var messagePanel = $("#productsuccessalert");
            messagePanel.text('Click on an image to select new file');
            messagePanel.removeClass('alert-sucess');
            messagePanel.removeClass('hide');
            messagePanel.addClass('alert-danger');
            messagePanel.fadeTo(2000, 500).slideUp(500, function () {
                $("#productsuccessalert").slideUp(500);
            });
        }
    });
}, false);

function uploadLinkClik(element) {

    var id = $(element).data('id');
    console.log(id);
    $("#upload:hidden").data("id", id);
    $("#upload:hidden").trigger('click');
}


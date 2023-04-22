$(document).ready(function () {
    $(".navbar-toggler").on("blur", function () {
        let windowWidth = window.innerWidth
        if (windowWidth < 991) {
            setTimeout(() => {$(".navbar-collapse").collapse("hide");},100)
        }
    });
});
(function (global) {
    let AS = {};
    const homeHtml = "snippets/home-snippt.html",
        allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json",
        categoriesTitleHtml = "snippets/categories-title-sinppet.html",
        categoriesHtml = "snippets/categories-snippet.html",
        menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/",
        menuItmesTitleHtml = "snippets/menu-items-title.html",
        menuItemsHtml = "snippets/menu-items.html",
        awardsHtml = "snippets/awards.html",
        aboutHtml = "snippets/about.html",
        specialCateogories = "special-categories.html";
    // for inserting html 
    let insertHtml = function (selector, htmlText) {
        let targetEle = document.querySelector(selector)
        targetEle.innerHTML = htmlText
    }
    // show loading icon inside element identifed by 'selector'.
    let showLoading = function (selector) {
        let htmlText = "<div class = 'text-center'>"
        htmlText += "<img src ='images/Spinner-1s-219px.gif'></div>"
        insertHtml(selector, htmlText)
    }
    //  return the vlaue of porperty 
    const insertProperty = function (string, propName, propValue) {
        let propToReplace = "{{" + propName + "}}"
        string = string.replace(new RegExp(propToReplace, "g"), propValue)
        return string
    }
    // on page load before images and css
    document.addEventListener("DOMContentLoaded", function () {
        $ajaxUtils.sendGetHttpRequest(homeHtml, function (responseText) {
            document.querySelector("#Tiles .container").innerHTML = responseText
        }, false)
    })
    // when click on tilte or image go to main page
    AS.loadMainPage = function () {
        $ajaxUtils.sendGetHttpRequest(homeHtml, function (responseText) {
            document.querySelector("#Tiles .container").innerHTML = responseText
        }, false)
    }
    // when click on Awards go to Awards page
    AS.loadAwardsPage = function () {
        showLoading("#Tiles .container")
        $ajaxUtils.sendGetHttpRequest(awardsHtml, function (responseText) {
            document.querySelector("#Tiles .container").innerHTML = responseText
        }, false)
    }
    // go to about page
    AS.loadAboutPage = function () {
        showLoading("#Tiles .container")
        $ajaxUtils.sendGetHttpRequest(aboutHtml, function (responseText) {
            document.querySelector("#Tiles .container").innerHTML = responseText
        }, false)
    }
    // load the menu category view 
    AS.loadMenuCategories = function () {
        showLoading("#Tiles .container")
        $ajaxUtils.sendGetHttpRequest(allCategoriesUrl, buildAndShowCategoriesHtml)
    }
    // buil categories 
    AS.loadMenuItems = function (catogoryShort) {
        showLoading("#Tiles .container");
        $ajaxUtils.sendGetHttpRequest(
            menuItemsUrl + catogoryShort + ".json",
            buildAndShowItemsHtml
        );
    }
    function buildAndShowCategoriesHtml(categories) {
        
        $ajaxUtils.sendGetHttpRequest(
            categoriesTitleHtml,
            function (categoriesTitleHtml) {
                // Retrieve single category snippet
                $ajaxUtils.sendGetHttpRequest(
                    categoriesHtml,
                    function (categoriesHtml) {
                        let categoriesViewHtml = buildCategoriesViewHtml(categories, categoriesTitleHtml, categoriesHtml)
                        insertHtml("#Tiles .container", categoriesViewHtml)
                    }, false)
            }, false)
    }
    // build categories view 
    function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoriesHtml) {
        let finalHtml = categoriesTitleHtml;
        finalHtml += "<section class= 'row'>"
        // loop over categories 
        for (let i = 0; i < categories.length; i++) {
            let html = categoriesHtml;
            let name = "" + categories[i].name;
            let short_name = categories[i].short_name;
            html = insertProperty(html, "name", name);
            html = insertProperty(html, "short_name", short_name)
            finalHtml += html
        }
        finalHtml += "</section>"
        return finalHtml
    }
    // buid html the single category page based on json data 
    function buildAndShowItemsHtml(categoryMenuItems) {
        $ajaxUtils.sendGetHttpRequest(
            menuItmesTitleHtml,
            function (menuItmesTitleHtml) {
                $ajaxUtils.sendGetHttpRequest(
                    menuItemsHtml,
                    function (menuItemsHtml) {
                        let menuItemsViewHtml =
                        buildMenuItemsViewHtml(categoryMenuItems,
                            menuItmesTitleHtml,
                            menuItemsHtml);
                            insertHtml("#Tiles .container", menuItemsViewHtml)
                        }, false);
                    }, false)
                }
                // build menu items view to be inserted into page
                function buildMenuItemsViewHtml(categoryMenuItems,
                    menuItmesTitleHtml,
                    menuItemsHtml) {
                        menuItmesTitleHtml = insertProperty(menuItmesTitleHtml, "name", categoryMenuItems.category.name);
                        menuItmesTitleHtml = insertProperty(menuItmesTitleHtml, "special_instructions", categoryMenuItems.category.special_instructions);
        let finalHtml = menuItmesTitleHtml;
        finalHtml += "<section class = 'row'>"
        // loop over menu items  
        let menuItems = categoryMenuItems.menu_items;
        let catShortName = categoryMenuItems.category.short_name;
        
        for (let i = 0; i < menuItems.length; i++) {
            let html = menuItemsHtml;
            html = insertProperty(html, "short_name", menuItems[i].short_name);
            html = insertProperty(html, "catShortName", catShortName);
            html = insertItemPrice(html, "price_small", menuItems[i].price_small);
            html = insertProperty(html, "small_portion_name", menuItems[i].small_portion_name ?? "");
            html = insertItemPrice(html, "price_large", menuItems[i].price_large);
            html = insertProperty(html, "large_portion_name", menuItems[i].large_portion_name ?? "");
            html = insertProperty(html, "name", menuItems[i].name);
            html = insertProperty(html, "description", menuItems[i].description);
            finalHtml += html
        }
        finalHtml += "</section>"
        return finalHtml
    }
    // append price with dollar if price exist 
    function insertItemPrice(html, pricePropName, priceValue) {
        if (!priceValue) {
            return insertProperty(html, pricePropName, "")
        }
        priceValue = "$" + priceValue.toFixed(2)
        html = insertProperty(html, pricePropName, priceValue)
        return html
    }

    // add active class 

    function addActiveClass() {
        document.addEventListener("DOMContentLoaded",() => {
            const linksParent = document.querySelector(".navbar-nav")
            const mainLinks = document.querySelectorAll(".mainLink")
            mainLinks.forEach((mainLink) => {
                mainLink.addEventListener("click",() => {
                        document.querySelectorAll(".nav-item").forEach((link) => link.classList.remove("active"))  
                        document.querySelector(".nav-item").classList.add("active") 
                    })
                })
            linksParent.addEventListener("click",(e) => {
                const clickedLink = e.target.closest(".nav-item")
                if(clickedLink) {
                    // Remove "active" class from all links
                    const allLinks = linksParent.querySelectorAll(".nav-item")
                    allLinks && allLinks.forEach((link) => link.classList.remove("active"))
                    // Add "active" class when link is clicked
                    clickedLink.classList.add("active")
                }
            })
        })
    }
    addActiveClass()
    
    global.$AS = AS
    
})(window)

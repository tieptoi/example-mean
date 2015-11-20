"use strict";
angular.module("todoApp", ["angularUtils.directives.dirPagination", "ngRoute", "satellizer", "toastr", "ngAnimate", "ui.bootstrap", "ngMessages", "angularFileUpload", "app.routes", "ngCookies"]).config(["$provide", function (a) {
    a.decorator("$rootScope", ["$delegate", function (a) {
        return Object.defineProperty(a.constructor.prototype, "$onRootScope", {
            value: function (b, c) {
                var d = a.$on(b, c);
                return this.$on("$destroy", d), d
            },
            enumerable: !1
        }), a
    }])
}]), angular.module("app.routes", ["ngRoute"]).config(["$routeProvider", "$locationProvider", "$authProvider", function (a, b, c) {
    function d(a, b, c) {
        var d = a.defer();
        return c.isAuthenticated() ? b.path("/") : d.resolve(), d.promise
    }

    function e(a, b, c) {
        var d = a.defer();
        return c.isAuthenticated() ? d.resolve() : b.path("/login"), d.promise
    }
    a.when("/", {
        templateUrl: "partials/shared/main",
        controller: "MainController"
    }).when("/item", {
        templateUrl: "partials/item/items",
        controller: "ItemController"
    }).when("/item/create", {
        templateUrl: "partials/item/createItem",
        controller: "CreateItemController"
    }).when("/item/edit/:qkey/:qvalue", {
        templateUrl: "partials/item/createItem",
        controller: "CreateItemController",
        resolve: {
            loginRequired: e
        }
    }).when("/login", {
        templateUrl: "partials/auth/login",
        controller: "LoginController",
        resolve: {
            skipIfLoggedIn: d
        }
    }).when("/signup", {
        templateUrl: "partials/auth/signup",
        controller: "SignUpController",
        resolve: {
            skipIfLoggedIn: d
        }
    }).when("/contact", {
        templateUrl: "partials/shared/contact"
    }).when("/about", {
        templateUrl: "partials/shared/about"
    }).otherwise({
        redirectTo: "/"
    }), c.loginUrl = "/login", c.signupUrl = "/signup", c.unlinkUrl = "/logout/", c.facebook({
        url: "/facebook",
        clientId: "478091019019627"
    }), d.$inject = ["$q", "$location", "$auth"], e.$inject = ["$q", "$location", "$auth"], b.html5Mode(!0)
}]).run(["$rootScope", "$window", "$auth", function (a, b, c) {
    c.isAuthenticated() && (b.localStorage.currentUser && "" !== b.localStorage.currentUser ? a.currentUser = JSON.parse(b.localStorage.currentUser) : c.logout())
}]), angular.module("todoApp").controller("MainController", ["$scope", "$auth", function (a, b) {
    a.isAuthenticated = function () {
        return b.isAuthenticated()
    }
}]), angular.module("todoApp").controller("ItemController", ["$scope", "$filter", "$uibModal", "Item", function (a, b, c, d) {
    a.items = [], a.tab = 1, a.sortOrder = "", a.currentPage = 1, a.pageSize = 8, a.totalItems = 0, a.animationsEnabled = !0, a.modalSize = "md", d.getItemsByPages(a.currentPage, a.pageSize, "name").success(function (b) {
        a.items = b, angular.forEach(a.items, function (a) {
            a.orderQuantity = 1
        })
    }).error(function (a) {
        console.log(a)
    }), d.getNoOfItems().success(function (b) {
        a.totalItems = b
    }).error(function (a) {
        console.log(a)
    }), a.open = function (b) {
        var e = c.open({
            animation: a.animationsEnabled,
            templateUrl: "template/itemModalView.html",
            controller: "ModalItemController",
            size: a.modalSize,
            resolve: {
                item: function () {
                    return b
                }
            }
        });
        e.result.then(function (a) {
            a.views = a.views + 1, d.updateItem(a).success(function (a) {
                console.log(a)
            }).error(function (a) {
                console.log(a)
            })
        }, function () {
            console.info("Modal dismissed at: " + new Date)
        })
    }, a.getPrice = function (a) {
        return a.isSale ? a.price - a.price * (a.discountPct / 100) : a.price
    }, a.sortChange = function () {
        "" !== a.sortOrder && (a.items = a.sort(a.items))
    }, a.sort = function (c) {
        return "" !== a.sortOrder ? b("orderBy")(c, a.sortOrder.split("-")[0], "desc" === a.sortOrder.split("-")[1] ? !0 : !1) : c
    }, a.add = function (b) {
        a.$emit("add2Cart", b)
    }, a.pageChangeHandler = function (b) {
        d.getItemsByPages(b, a.pageSize, "name").success(function (b) {
            a.items = a.sort(b), angular.forEach(a.items, function (a) {
                a.orderQuantity = 1
            })
        }).error(function (a) {
            console.log(a)
        })
    }, a.perPageChange = function () {
        "" !== a._pageSize ? a.pageSize = a._pageSize : "" !== a._pageSize && (a.pageSize = a.items.length), a.currentPage = 1
    }
}]).controller("ModalItemController", ["$scope", "$uibModalInstance", "$location", "Item", "item", function (a, b, c, d, e) {
    a.item = e, a.ok = function () {
        b.close(a.item)
    }, a.cancel = function () {
        b.dismiss("cancel")
    }, a.isSelected = function (b) {
        return b === a.tab
    }, a.selectTab = function (b) {
        a.tab = b
    }, a.add = function (c, d) {
        d.$valid && (b.close(a.item), a.$emit("add2Cart", c))
    }, a.edit = function (d) {
        b.close(a.item), c.path("/item/edit/id/" + d._id)
    }
}]).controller("CreateItemController", ["$scope", "$location", "Item", "FileUploader", "$routeParams", "$auth", function (a, b, c, d, e, f) {
    a.header = "", a.id = e.qvalue;
    var g = a.uploader = new d({
        url: "/api/upload",
        queueLimit: 5,
        filters: [{
            name: "photoType",
            fn: function (a) {
                var b = "|" + a.type.slice(a.type.lastIndexOf("/") + 1) + "|";
                return -1 !== "|jpg|png|jpeg|bmp|gif|".indexOf(b)
            }
        }, {
            name: "isDuplicate",
            fn: function (a) {
                var b = !0;
                return angular.forEach(g.queue, function (c, d) {
                    c._file.name === a.name && c._file.size === a.size && (b = !0)
                }), b
            }
        }]
    });
    ! function () {
        a.id && "" !== a.id ? c.getItemByID(a.id).success(function (b) {
            a.item = b, c.getImages(b.image).success(function (a, c, d, e) {
                var f = new File([a], b.image, {
                    type: a.type
                });
                g.addToQueue(f), g.queue[0].upload()
            })
        }).error(function (a) {
            console.error(a)
        }) : a.item = {};
        var d = b.path().split("/");
        d && d.indexOf("edit") > -1 ? a.header = "Edit Item" : a.header = "Create Item"
    }(), g.onAfterAddingFile = function (b) {
        console.log(g.queue[0].file.name), console.log(a.item), a.item.image = b.file.name
    }, g.onWhenAddingFileFailed = function (a, b, c) {
        console.log(a), console.log(b), console.log(c)
    }, a.submitForm = function (b) {
        b && f.isAuthenticated() && swal({
            title: "Are you sure?",
            text: "You will not be able to recover this item!",
            type: "warning",
            showCancelButton: !0,
            confirmButtonColor: "#A5DC86",
            confirmButtonText: "Yes, save it!",
            closeOnConfirm: !1,
            showLoaderOnConfirm: !0
        }, function () {
            setTimeout(function () {
                var b;
                b = a.header && "Edit Item" === a.header ? c.updateItem(a.item) : c.addItem(a.item), b.success(function (a) {
                    swal({
                        title: "Saved!",
                        text: "Your item has been updated successfully.",
                        type: "success",
                        timer: 1e3,
                        showConfirmButton: !1
                    }), console.log(a)
                }).error(function (a) {
                    swal({
                        title: "Failed!",
                        text: "You dont have permission to update this item.",
                        type: "error",
                        timer: 1e3,
                        showConfirmButton: !1
                    }), console.error(a)
                })
            }, 2e3)
        })
    }
}]), angular.module("todoApp").controller("LoginController", ["$scope", "$auth", "$window", "$rootScope", "$location", "toastr", function (a, b, c, d, e, f) {
    a.login = function () {
        b.login(a.user).then(function (a) {
            c.localStorage.currentUser = JSON.stringify(a.data.user), d.currentUser = JSON.parse(c.localStorage.currentUser), f.success("You have successfully signed in"), e.path("/")
        })["catch"](function (a) {
            f.error(a.data.message, a.status)
        })
    }, a.authenticate = function (a) {
        b.authenticate(a).then(function (g) {
            b.setToken(g.data.token), c.localStorage.currentUser = JSON.stringify(g.data.user), d.currentUser = JSON.parse(c.localStorage.currentUser), f.success("You have successfully signed in with " + a), e.path("/")
        })["catch"](function (a) {
            console.log(a), f.error(a.data.message)
        })
    }
}]).controller("SignUpController", ["$scope", "$auth", "$window", "$rootScope", "$location", "toastr", function (a, b, c, d, e, f) {
    a.signup = function () {
        console.log(a.user), b.signup(a.user).then(function (a) {
            b.setToken(a.data.token), c.localStorage.currentUser = JSON.stringify(a.data.user), d.currentUser = JSON.parse(c.localStorage.currentUser), f.info("You have successfully created a new account and have been signed-in"), e.path("/")
        })["catch"](function (a) {
            f.error(a.data.message)
        })
    }
}]), angular.module("todoApp").controller("NavbarController", ["$scope", "$rootScope", "$location", "$auth", "$window", "toastr", function (a, b, c, d, e, f) {
    a.menus = [{
        title: "Home",
        link: "/"
    }, {
        title: "Item",
        link: "/item",
        submenus: [{
            link: "/item/create",
            title: "Create Item"
        }]
    }, {
        title: "Contact Us",
        link: "/contact"
    }, {
        title: "About Us",
        link: "/about"
    }], b.$watch("currentUser", function (b, c) {
        a.user = b
    }), a.isAuthenticated = function () {
        return d.isAuthenticated()
    }, a.logout = function () {
        d.logout(), delete e.localStorage.currentUser, a.$emit("rmCart"), f.success("You have successfully logged out"), c.path("/")
    }, a.isActive = function (a) {
        return a === c.path() || a.length > 1 && c.path().indexOf(a) > -1
    }, a.hasSubMenu = function (a) {
        return a.submenus && a.submenus.length > 0
    }
}]).controller("CartController", ["$scope", "$cookies", function (a, b) {
    a.cart = {}, a.$watch("cart", function (c, d) {
        b.putObject("cart", c), a.changeQuantity()
    }, !0), a.$onRootScope("rmCart", function () {
        b.remove("cart"), a.cart = a.getCart()
    }), a.getCart = function () {
        return b.getObject("cart") && null !== b.getObject("cart") ? b.getObject("cart") : {
            items: [],
            total: 0
        }
    }, a.cart = a.getCart(), a.$onRootScope("add2Cart", function (b, c) {
        var d = !1;
        angular.forEach(a.cart.items, function (a) {
            a.name === c.name && (d = !0, a.orderQuantity = a.orderQuantity + c.orderQuantity)
        }), d || a.cart.items.push({
            description: c.description,
            image: c.image,
            quantity: c.quantity,
            name: c.name,
            pid: c.pid,
            price: c.price,
            orderQuantity: c.orderQuantity
        }), swal({
            title: "Added to cart",
            type: "success",
            timer: 700,
            showConfirmButton: !1
        })
    }), a.remove = function (b) {
        a.cart.items.splice(a.cart.items.indexOf(b), 1)
    }, a.changeQuantity = function () {
        a.cart.total = 0, angular.forEach(a.cart.items, function (b) {
            b.orderQuantity > 0 && (a.cart.total = a.cart.total + b.orderQuantity * b.price)
        })
    }
}]), angular.module("todoApp").service("Thing", ["$http", function (a) {
    this.getThings = function () {
        return a.get("/api/awesomeThings")
    }, this.getThing = function (b) {
        return a.get("/api/awesomeThing/" + b)
    }, this.addThing = function (b) {
        return a.post("/api/addThing", JSON.stringify(b))
    }
}]), angular.module("todoApp").service("Item", ["$http", function (a) {
    this.getItems = function () {
        return a.get("/api/items")
    }, this.getItemByID = function (b) {
        return a.get("/api/item/_id/" + b)
    }, this.getNoOfItems = function () {
        return a.get("/api/noOfItems")
    }, this.getItemsByPages = function (b, c, d) {
        return a.get("/api/items/pages/" + b + "/size/" + c + "/sort/" + d)
    }, this.getNoOfItems = function () {
        return a.get("/api/noOfItems")
    }, this.addItem = function (b) {
        return a.post("/api/addItem", JSON.stringify(b))
    }, this.updateItem = function (b) {
        return a.post("/api/updateItem", JSON.stringify(b))
    }, this.getImages = function (b) {
        var c = {
            method: "GET",
            url: "/images/" + b,
            responseType: "blob"
        };
        return a(c)
    }
}]), angular.module("todoApp").directive("ngThumb", ["$window", function (a) {
    var b = {
        support: !(!a.FileReader || !a.CanvasRenderingContext2D),
        isFile: function (b) {
            return angular.isObject(b) && b instanceof a.File
        },
        isImage: function (a) {
            var b = "|" + a.type.slice(a.type.lastIndexOf("/") + 1) + "|";
            return -1 !== "|jpg|png|jpeg|bmp|gif|".indexOf(b)
        }
    };
    return {
        restrict: "A",
        template: "<canvas/>",
        link: function (a, c, d) {
            function e(a) {
                var b = new Image();
                b.onload = f;
                b.src = a.target.result;
            }

            function f() {
                var a = g.width || this.width / this.height * g.height,
                    b = g.height || this.height / this.width * g.width;
                h.attr({
                    width: a,
                    height: b
                }), h[0].getContext("2d").drawImage(this, 0, 0, a, b)
            }
            if (b.support) {
                var g = a.$eval(d.ngThumb);
                if (b.isFile(g.file) && b.isImage(g.file)) {
                    var h = c.find("canvas"),
                        i = new FileReader;
                    i.readAsDataURL(g.file), i.onload = e
                }
            }
        }
    }
}]), angular.module("todoApp").directive("passwordMatch", function () {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=passwordMatch"
        },
        link: function (a, b, c, d) {
            d.$validators.compareTo = function (b) {
                return b === a.otherModelValue
            }, a.$watch("otherModelValue", function () {
                d.$validate()
            })
        }
    }
});

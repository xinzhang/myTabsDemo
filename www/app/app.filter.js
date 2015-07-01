
angular.module('app').filter('total', ['$parse', function ($parse) {
    return function (input, property) {
        var i = input instanceof Array ? input.length : 0,
            p = $parse(property);

        if (typeof property === 'undefined' || i === 0) {
            return i;
        } else if (isNaN(p(input[0]))) {
            throw 'filter total can count only numeric values';
        } else {
            var total = 0;
            while (i--)
                total += p(input[i]);
            return total;
        }
    };
}]);

angular.module('app').filter("dateRangefilter", function () {
    return function (items, range, monthlyStartDay) {

        var arrayToReturn = [];

        if (items == null)
            return arrayToReturn;

        var from = new Date(1900, 0, 1);
        var to = new Date(2500, 11, 31);

        if (range == 'today') {
            from = new Date();
            from.setHours(0, 0, 0, 0);
            to = new Date();
            to.setHours(23, 59, 59, 0);
        }

        if (range == 'thisweek') {
            var curr = new Date();
            curr.setHours(0, 0, 0, 0);
            from = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
            to = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));
            console.log(from);
            console.log(to);
        }

        if (range == 'thismonth') {
            var curr = new Date;
            curr.setHours(0, 0, 0, 0);
            from = new Date(curr.getFullYear(), curr.getMonth(), 1);
            to = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
        }

        if (range == 'thisbudgetmonth') {
            var curr = new Date;
            //var monthlyStartDay = 15;
            
            curr.setHours(0, 0, 0, 0);

            if (curr.getDay() < monthlyStartDay) {
                from = new Date(curr.getFullYear(), curr.getMonth() - 1, monthlyStartDay);
                to = new Date(curr.getFullYear(), curr.getMonth(), monthlyStartDay - 1);
            }
            else {
                from = new Date(curr.getFullYear(), curr.getMonth(), monthlyStartDay);
                to = new Date(curr.getFullYear(), curr.getMonth() + 1, monthlyStartDay - 1);
            }
        }

        for (var i = 0; i < items.length; i++) {
            var transdate = new Date(items[i].transactionDate);
            if (transdate > from && transdate < to) {
                arrayToReturn.push(items[i]);
            }
        }

        return arrayToReturn;
    };
});

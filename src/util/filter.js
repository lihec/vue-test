
import Vue from 'vue';

Vue.filter('date', function (value, pattern) {
    return NameSpace.dateFormat(value,pattern|'yyyy-MM-dd HH:mm:ss');
});
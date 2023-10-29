// Đối tượng 'validator'
//options là các properties and method
function Validator (options) {
    //  form  validate
    var formElement = document.querySelector(options.form);

    // lưu lại tất cả các rule 
    var selectorRules = {};

    function validate(inputElement,rule){ 
        //  thẻ span
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        // nội dung trong thẻ span
        var errorMessage ;
        // lấy ra các rules của selector
        var rules = selectorRules[rule.selector];
        
        // lặp qua từng rule & check
        // nếu có lỗi thì dừng
        for( var i = 0; i < rules.length; i++ ) {
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }
        
        if(errorMessage) {
            errorElement.innerText = errorMessage ;
            inputElement.parentElement.classList.add('invalid');
        }else {
            errorElement.innerText = ' ';
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage;
    }
    if(formElement) {
        //khi click submit form
        formElement.onSubmit = function(e) {
            e.preventDefault();
            var isFormValid = true;
            options.rules.forEach(function(rule){
                // element thẻ input
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if(isValid == false) {
                    isFormValid = false;
                }
            });
            if(isFormValid){
                if(typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce( function(values,input) {
                        return (values[input.name] = input.value) && values;
                    },{});
                    options.onSubmit(formValues);
                }
            }
            
        }
        

        //lặp qua mỗi rule và xử lý(lắng nghe sự kiện)
        options.rules.forEach(function(rule){

            // lưu lại các rules cho mỗi input
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);

            } else {
                selectorRules[rule.selector] =  [rule.test];
            }

            // element thẻ input
            var inputElement = formElement.querySelector(rule.selector);
            
            if(inputElement) {
                //xử lí case khi blur ra ngoài
                inputElement.onblur = function(){
                    validate(inputElement,rule);

                }

                //xử lí  khi user input
                inputElement.oninput = function() {

                    // element thẻ span
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = ' ';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        });
        
    }
    

}

// định nghĩa các rules
// nguyên tắc của các rules
// 1. khi error thì => trả message lỗi
// 2. khi hợp lệ => ko return j cả( undefined)
Validator.isRequired = function(selector, message) {
    return {
        selector:selector,
        test: function(value) {
            return value.trim() ? undefined: message ||"sai goi";
        }
    }
}

Validator.isEmail = function(selector, message) {
    return {
        selector:selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined: message ||"sai zui";
        }
    }
}


Validator.passwordMinlength = function(selector, min, message){
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined: message ||`phai tren ${min} ki tu`;
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message){
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined: message ||'sai goi';
        }
    }
}
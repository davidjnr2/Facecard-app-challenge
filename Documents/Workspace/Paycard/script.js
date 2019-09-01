    const supportedCards = {visa, mastercard};
    const countries = [
         {
             code: "US",
             currency: "USD",
             country: 'United States'
         },
         {
             code: "NG",
             currency: "NGN",
             country: 'Nigeria'
         },
         {
             code: 'KE',
             currency: 'KES',
             country: 'Kenya'
         },
         {
             code: 'UG',
             currency: 'UGX',
             country: 'Uganda'
         },
         {
             code: 'RW',
             currency: 'RWF',
             country: 'Rwanda'
         },
         {
             code: 'TZ',
             currency: 'TZS',
             country: 'Tanzania'
         },
         {
             code: 'ZA',
             currency: 'ZAR',
             country: 'South Africa'
         },
         {
             code: 'CM',
             currency: 'XAF',
             country: 'Cameroon'
         },
         {
             code: 'GH',
             currency: 'GHS',
             country: 'Ghana'
         }
     ];
   
  const appState = {};
    
   //This function formats the buyer's country with their currency symbol
   
  const formatAsMoney = (amount, buyerCountry) => {
    const country = countries.find(product => product.country === buyerCountry) || countries[0];
      return amount.toLocaleString(`en-${country.code}`, {style: "currency",currency: country.currency
         });
     };
   
   //This function is used to mark an input entry as invalid (strike-though) nor not.
   const flagIfInvalid = (field, isValid) => {
     if (isValid) {
       field.classList.remove("is-invalid");
     }  else {
           field.classList.add("is-invalid");
     }
   };      
                    
        //This function detects the card type, (a Visa or MasterCard logo) depending on the card number entered by the user.     
        const detectCardType = ({ target }) => {
         const cardType = document.querySelector('div[data-credit-card]');
         const logo = document.querySelector('img[data-card-type]');         
         const numberValue = target.value;

         if (numberValue.startsWith(4)) {
             cardType.classList.remove('is-mastercard');
             cardType.classList.add('is-visa');
             logo.src = supportedCards.visa;
             return 'is-visa';
         } else if (numberValue.startsWith(5)) {
             cardType.classList.remove('is-visa');
             cardType.classList.add('is-mastercard');
             logo.src = supportedCards.mastercard;

             return 'is-mastercard';
         } else {
             cardType.classList.remove('is-visa');
             cardType.classList.remove('is-mastercard');
             logo.src = 'https://placehold.it/120x60.png?text=Card';
         }
     };
       
   //This function takes a target parameter representing the card's expiry date field.
      const expiryDateFormatIsValid = (target) => {
       return /^([0-9]{2})\/([0-9]{2}$)/.test(target.value);
     };   
   
     //This function returns true if the value provided matches the MM/YY format
   
       const validateCardExpiryDate = ({ target }) => {
         const numberValue = target.value;
         const numberValueDate = new Date();

         numberValueDate.setFullYear('20' + numberValue.substr(3, 2), numberValue.substr(0, 2));

         const isValid = expiryDateFormatIsValid(target) && (numberValueDate > new Date());

         flagIfInvalid(target, isValid);

         return isValid;
     };
   
   //This function validates the card holders Name and Surname (Each name should being at least 3 characters long) 
     const validateCardHolderName = ({ target }) => {
         const isValid = /^([a-zA-Z]{3,}) ([a-zA-Z]{3,})$/.test(target.value);

         flagIfInvalid(target, isValid);

         return isValid;
     };
   // The Luhn Algorithm
       const validateWithLuhn = (digits) => {
         if (digits.length === 16) {
             let digits_sum = 0;

             for (let i = digits.length - 1, doubled_digit; i >= 0; --i) {
                 if (isNaN(digits[i])) {
                     return false;
                 }

                 doubled_digit = i % 2 ? digits[i] : digits[i] * 2;

                 digits_sum += doubled_digit > 9 ? doubled_digit - 9 : doubled_digit;
             }

             return !(digits_sum % 10);
         } else {
             return false;
         }
     };

   
   //This function validates the card Number
   
       const validateCardNumber = () => {
         const selectAll = (s) => {
             return document.querySelectorAll(s);
         };
         const fields = [...selectAll('div[data-cc-digits]>input')];
         const cardNumber = fields.reduce((acc, field) => {
             return acc + field.value;
         }, '').split('').map((digit) => {
             return +digit;
         });

         const isValid = validateWithLuhn(cardNumber);

         const div = document.querySelector('div[data-cc-digits]');

         if (isValid) {
             div.classList.remove('is-invalid');

         } else {
             div.classList.add('is-invalid');
         }

         return isValid;
     };   
     
     
   //This function will trigger event handling for the buttn, first four digit i=of the pin.....
     const uiCanInteract = () => {
         document.querySelector('div[data-cc-digits]>input:first-child').addEventListener('blur', detectCardType);

         document.querySelector('div[data-cc-info]>input:first-child').addEventListener('blur', validateCardHolderName);

         document.querySelector('div[data-cc-info]>input:nth-child(2)').addEventListener('blur', validateCardExpiryDate);

         document.querySelector('button[data-pay-btn]').addEventListener('click', validateCardNumber);

         document.querySelector('div[data-cc-digits]>input:first-child').focus();
     }; 
     //This function takes in an amount and a buyerCountry parameter to format the user's bill as a proper currency. 
     const displayCartTotal = ({results}) => {
     const [data] = results;                    
     const {itemsInCart, buyerCountry} = data;        
     appState.items = itemsInCart;        
     appState.country = buyerCountry;       
     appState.bill = itemsInCart.reduce((total, cart)=> { 
       return (total.price * total.qty) + (cart.price * cart.qty); 
     });         
     appState.billFormatted = formatAsMoney(appState.bill, appState.country);       
     document.querySelector('[data-bill]').textContent = appState.billFormatted;        
     uiCanInteract();
   };  
       
   //This function assigns the URL to an api variable to display the total payment bill      
   const fetchBill = () => {      
     const api = "https://randomapi.com/api/006b08a801d82d0c9824dcfdfdfa3b3c";
     fetch(api)
       .then(response => response.json())
       .then(data => {displayCartTotal(data)})
       .catch(error => console.log("Something went wrong, error"));    
   };       
     const startApp = () => {
     fetchBill();
   };
     startApp();		
                  
     const supportedCards = {
        visa, mastercard
      };

      const countries = [
        {
          code: "US",
          currency: "USD",
          currencyName: '',
          country: 'United States'
        },
        {
          code: "NG",
          currency: "NGN",
          currencyName: '',
          country: 'Nigeria'
        },
        {
          code: 'KE',
          currency: 'KES',
          currencyName: '',
          country: 'Kenya'
        },
        {
          code: 'UG',
          currency: 'UGX',
          currencyName: '',
          country: 'Uganda'
        },
        {
          code: 'RW',
          currency: 'RWF',
          currencyName: '',
          country: 'Rwanda'
        },
        {
          code: 'TZ',
          currency: 'TZS',
          currencyName: '',
          country: 'Tanzania'
        },
        {
          code: 'ZA',
          currency: 'ZAR',
          currencyName: '',
          country: 'South Africa'
        },
        {
          code: 'CM',
          currency: 'XAF',
          currencyName: '',
          country: 'Cameroon'
        },
        {
          code: 'GH',
          currency: 'GHS',
          currencyName: '',
          country: 'Ghana'
        }
      ];

      const billHype = () => {
        const billDisplay = document.querySelector('.mdc-typography--headline4');
        if (!billDisplay) return;
	
        billDisplay.addEventListener('click', () => {
          const billSpan = document.querySelector("[data-bill]");
          if (billSpan &&
            appState.bill &&
            appState.billFormatted &&
            appState.billFormatted === billSpan.textContent) {
            window.speechSynthesis.speak(
              new SpeechSynthesisUtterance(appState.billFormatted)
            );
          }
        });
      };

	  const appState = {};

//This function formats the user's total bill as a proper currency 
	  const formatAsMoney = (amount, buyerCountry) => {
		  const country = countries.find(amount => amount.country === buyerCountry) || countries [0];
		  return amount.toLocaleString(`en-${country.code}`, {style: "currency", currency: country.currency});
	  };

//This function validates all invalid input entries with a strike-through or not
	 const flagIfInvalid = (field, isValid) => {
		  field.classList.toggle('is-invalid', !isValid);		
		  console.log("Is the card valid?", isValid);
	 };
//This function returns true if the expiry date format complies with MM/YY format
	 const expiryDateFormatIsValid = (field) => {
		 const dateFormat = /^([1-9]|0[1-9]|1[0-2])\/([0-9][0-9])$/;
		 const fieldParam = field.value;
		 return dateFormat.test(fieldParam);
	 };

//This function	is called with the API  data to display the total bill to be paid
	const displayCartTotal = ({results}) => {
		const [data] = results;
		const {itemsInCart, buyerCountry} = data;
		appState.items = itemsInCart;
		appState.country = buyerCountry;
		appState.bill = itemsInCart.reduce((total, {price, qty}) => total + (price * qty), 0);
		appState.billFormatted = formatAsMoney(appState.bill, appState.country);
		document.querySelector('[data-bill').textContent = appState.billFormatted;
		appState.cardDigits  = [];
		console.log(typeof appState.cardDigits);
		appState.cardDigits[0] = [];
		appState.cardDigits[1] = [];
		appState.cardDigits[2] = [];
		appState.cardDigits[3] = [];
		appState.cardDigits[4] = [];
		appState.cardDigits[5] = [];
		// for (i = 0; i < appState.cardDigits.value.length < i++)	{
		// 	document.querySelector('[data-cc-info]>input')[1] = appState.cardDigits;
		// }

				
		uiCanInteract();
	  };

//This function displays visa or mastercard logo depending on the card number entered by the user (4 for visa and 5 for mastercard) 		
const detectCardType = (first4Digits) => {	
	const brandedFeel = document.querySelector('[data-credit-card]');	
	const brandedLogo = document.querySelector('[data-card-type]');
		  if (first4Digits[0] == 4) {			
			 console.log("This card is a visa card", first4Digits)
			 brandedFeel.classList.add('is-visa');
			 brandedFeel.classList.remove('is-mastercard');
			 brandedLogo.src = supportedCards.visa;
			 return 'is-visa';
			 
		  } else if (first4Digits[0] == 5) { 
			 console.log("This card is a mastercard", first4Digits);			
			 brandedFeel.classList.remove('is-visa');
			 brandedFeel.classList.add('is-mastercard');
			 brandedLogo.src = supportedCards.mastercard;
			 return 'is-mastercard';
			 
		 } else {
			 brandedFeel.classList.remove('is-visa');
			 brandedFeel.classList.remove('is-mastercard');
			 brandedLogo.src = 'https://placehold.it/120x60.png?text=Card';
		 }
	 };
//This function checks if the inputted expiry date format (MM/YY) is valid and also validates the expiry date with the flagIfInvalid function       
	 const validateCardExpiryDate = () => {		
		const ccInfo = document.querySelectorAll('[data-cc-info]>input')[1];
		const dateCheck = ccInfo.value;	
		const isFutureDate = (ccInfo) => { 	
		const [month, year]= dateCheck.split('/');
		const expDate = new Date(`20${year}/${month}`);
		const today = new Date();
		return (expDate > today);
		};
		 const checkCardExpiry = expiryDateFormatIsValid(ccInfo) && isFutureDate(ccInfo);
		 console.log("Valid card expiry date:", checkCardExpiry);
		 flagIfInvalid(ccInfo, checkCardExpiry);
		 console.log(checkCardExpiry);
		 return checkCardExpiry;		 		 
	 };

// This function validates the card name with flagIfInvalid function   
const validateCardHolderName = () => {
  const holderName = document.querySelectorAll('[data-cc-info]>input')[0];
	const nameSurname = holderName.value;
	console.log('Current Card Name is :', nameSurname);
	const isValid = (/^([A-Za-z]{3,})\s([A-Za-z]{3,})$/).test(nameSurname);
	flagIfInvalid(holderName, isValid);
	return isValid;	 
	 };

// This function returns true or false if the digits represent valid credit card number or not. 
	const validateWithLuhn = (digits) => {
		if (digits.length !== 16) return false;
		let total = 0;
		for (i = 0; i < digits.length; i++) {
			if (typeof (digits[i]) !== 'number') return false;
			if (i % 2 === 0) {
				let doubledNumber = digits[i] * 2;
				if (doubledNumber > 9) doubledNumber -= 9;
				total += doubledNumber;	
				//console.log("total:", total);			
			} else {
				total += Number(digits[i]);
			}
		}
		return (total % 10 === 0);
	};
//This functions validates the card numbers entered by the user
	 const validateCardNumber = () => {
		 let digits = '';
		 const cardField = document.querySelectorAll('[data-cc-digits] input');
		[...cardField].forEach(field => {
			digits += field.value;
		});
		 digits = appState.cardDigits.flat(Infinity);
		 //digits = digits.toString().split('').map(x=>parseInt(x));
		 console.log("Validated card is:", digits);
		 let isLurnOutcome = validateWithLuhn(digits);
		 const cfield = document.querySelector('[data-cc-digits]');
		 if(isLurnOutcome) {
			 cfield.classList.remove('is-valid');
			 console.log("Are the Card Numbers valid?", isLurnOutcome);
		 } else {
			 cfield.classList.add('is-valid');			 
		 console.log("Are the Card Numbers valid?", isLurnOutcome);
		 }		
	 };

	 const validatePayment = () => {
		 validateCardNumber();
		 validateCardHolderName();
		 validateCardExpiryDate();
	 };	
//This functions gives input focus to the first credit card number input field
const uiCanInteract = () => {
document.querySelector('div[data-cc-digits]>input:first-child').focus();
document.querySelector('[data-pay-btn]').addEventListener('click', validatePayment);

	 billHype();
	 enableSmartTyping();
	 };

//This function is called for every entry on every input field and only for valid entries 
const smartInput = (event, fieldIndex, fields) => {		 		 				 
	if(fieldIndex < 4 || fieldIndex == 5) {
		const navKeys = ['Tab', 'Delete', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Shift'];
		   const smartNavKeys = navKeys.includes(event.key);
		   console.log("Yes! valid key pressed", smartNavKeys);
		   
		    if (fieldIndex < 4 && !smartNavKeys){
			 event.preventDefault();
		 }
		      if (fieldIndex == 5 && !smartNavKeys && event.key =="/") {
			 event.preventDefault();
		 }

		 const cardHolderInput = parseInt(event.key);		 
		 const numberField = fields[fieldIndex];
		 console.log("Numberfield is", numberField);
		 const whenIsNaN = !Number.isNaN(cardHolderInput);
				 	 		 		 
		 if (isNaN(cardHolderInput)) {
			 return "Not a Number";
		 }
		 if(fieldIndex == 5 && !smartNavKeys && !event.key =="/"){
			 preventDefault();
		 }		 		  
    		if (numberField.value.length < numberField.getAttribute('size')) {
				appState.cardDigits[fieldIndex][numberField.value.length] = cardHolderInput;
				console.log("AppState value:", numberField.value, numberField.value.length, appState.cardDigits[fieldIndex], numberField.getAttribute('size'));
				numberField.value += cardHolderInput;
			}
				  if (fieldIndex == 0) {						
					  const first4Digits = appState.cardDigits[0];
					  detectCardType(first4Digits);					 					 
				 }		
				 if (fieldIndex < 3) {
					 setTimeout(() => {						 
						 let cardMask = '';
						 let first4Digits = '';
						 for(i = 0; i < numberField.value.length; i++){
							 cardMask += "#";
						 }
						 fields[fieldIndex].value = cardMask;
					 }, 500);					
		 	}		 		 
		
		}
	 };

//This function determines if the last entry has been recorded and then gives input focus to the next field in the sequence after half a second. 
	  const smartCursor = (event, fieldIndex, fields) => {
		  			  if (fieldIndex < fields.length -1) {
			  if (fields[fieldIndex].value.length === Number(fields[fieldIndex].size)) {
				  fields[fieldIndex + 1].focus();
			  } else {			
				  return false;
			  }
		  }
	  };
// This function collects all the input field into an array and uses .foreach() to iterate over them
	  const enableSmartTyping = () => {
		  const allInputFields = [...document.querySelectorAll('input')];
		console.log("All input Fields:", allInputFields);
		allInputFields.forEach((field, index, fields) => {
			field.addEventListener("keyup", (event) => {
				smartCursor(event, index, fields);
			});
			field.addEventListener("keydown", (event) => {
				smartInput(event, index, fields);
			});

		})
	  };
//This functions uses the browser's fetch to make an HTTP request to an api variable
	  const fetchBill = () => {
        const apiHost = 'https://randomapi.com/api';
		const apiKey = '006b08a801d82d0c9824dcfdfdfa3b3c';
		const apiEndpoint = `${apiHost}/${apiKey}`;
        fetch(apiEndpoint).then(response => response.json())		
		//.then(response => console.log('SUCCESS:', JSON.stringify(response)))
		.then(data => displayCartTotal(data))
		.catch(error => console.log('Awww! What went wrong?:', error));
	   };				
				
        const startApp = () => {
		  fetchBill();
      };	 					
      startApp();
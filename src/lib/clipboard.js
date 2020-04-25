export const copyToClipboard = (text, id) => {
  (function(window, navigator, document) {
    // Chrome, Firefox
    if (navigator.clipboard) {
      dispatchClipboardViaEvent(text, document);
    }
    // IE
    else if (window.clipboardData) {
      window.clipboardData.setData('text', text);
    }
    // Safari
    else {
      clipboardSafari(id, window, document);
    }
  })(window, navigator, document);
};

const dispatchClipboardViaEvent = (text, document) => {
  const copyHandler = e => {
    e.preventDefault();
    navigator.clipboard
      .writeText(text)
      // just remove the listener for either case
      .then(success => document.removeEventListener('copy', copyHandler), error => document.removeEventListener('copy', copyHandler));
  };
  document.addEventListener('copy', copyHandler);
  document.dispatchEvent(new Event('copy'));
};

const clipboardSafari = (id = '', window, document) => {
  const tempInput = document.querySelector(`#${id}`);
  // record dom editable and readOnly for later restoration
  const contentEditable = tempInput.contentEditable;
  const readOnly = tempInput.readOnly;
  // @ts-ignore
  tempInput.contentEditable = true;
  tempInput.readOnly = true;

  // range and selection are required for safari to work
  const range = document.createRange();
  range.selectNodeContents(tempInput);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  // if the selected dom are input or textarea
  tempInput.setSelectionRange && tempInput.setSelectionRange(0, 999999);
  document.execCommand('copy');
  // range is not available in chrome, only safari
  tempInput.contentEditable = contentEditable;
  tempInput.readOnly = readOnly;
};

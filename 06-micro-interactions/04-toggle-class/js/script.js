
const handleClickButton = (event) => {
    const $demoMessage = document.querySelector('.demo__message');
    event.currentTarget.classList.toggle('demo__button--active');
    $demoMessage.classList.toggle('demo__message--visible');
}

const init = () => {
    const $demoButton = document.querySelector('.demo__button');
    $demoButton.addEventListener('click', handleClickButton);
}

init();
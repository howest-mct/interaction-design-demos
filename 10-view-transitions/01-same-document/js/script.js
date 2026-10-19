const grid = document.querySelector('#grid');
const cards = grid.querySelectorAll('.card');

const setOpen = (openCard) => {
    cards.forEach((card) => {
        const isOpen = card === openCard;
        card.classList.toggle('is-open', isOpen);
        card.querySelector('.card__close').hidden = !isOpen;
        // de andere kaarten liggen eronder: ze zijn niet bereikbaar met het toetsenbord
        card.inert = openCard !== null && !isOpen;
    });
};

const update = (openCard, focusTarget) => {
    const apply = () => {
        setOpen(openCard);
        focusTarget.focus();
    };

    // fallback voor browsers zonder ondersteuning
    if (!document.startViewTransition) {
        apply();
        return;
    }

    // de richting bepaalt de volgorde van de animaties in de CSS
    const root = document.documentElement;
    root.dataset.direction = openCard ? 'open' : 'close';
    const transition = document.startViewTransition(apply);
    transition.finished.finally(() => delete root.dataset.direction);
};

grid.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (!card) return;

    if (event.target.closest('.card__close')) {
        update(null, card.querySelector('.card__open'));
    } else if (event.target.closest('.card__open')) {
        update(card, card.querySelector('.card__close'));
    }
});

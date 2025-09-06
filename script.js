let currentSticker = null;
let offsetX = 0, offsetY = 0;

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

document.querySelectorAll('.sticker').forEach(sticker => {
    const rect = sticker.getBoundingClientRect();
    sticker.style.left = `${rect.left}px`;
    sticker.style.top = `${rect.top}px`;
    sticker.style.transform = 'none';

    sticker.dataset.relX = rect.left / window.innerWidth;
    sticker.dataset.relY = rect.top / window.innerHeight;

    sticker.addEventListener('mousedown', (e) => {
        e.preventDefault();
        currentSticker = sticker;
        offsetX = e.pageX - sticker.offsetLeft;
        offsetY = e.pageY - sticker.offsetTop;
        sticker.classList.add('dragging');
    });
});

document.addEventListener('mousemove', (e) => {
    if (!currentSticker) return;

    let newLeft = e.pageX - offsetX;
    let newTop = e.pageY - offsetY;

    const maxLeft = window.innerWidth - currentSticker.offsetWidth;
    const maxTop = window.innerHeight - currentSticker.offsetHeight;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    currentSticker.style.left = `${newLeft}px`;
    currentSticker.style.top = `${newTop}px`;

    currentSticker.dataset.relX = newLeft / window.innerWidth;
    currentSticker.dataset.relY = newTop / window.innerHeight;
});

document.addEventListener('mouseup', () => {
    if (currentSticker) {
        currentSticker.classList.remove('dragging');
        currentSticker = null;
    }
});

window.addEventListener('resize', () => {
    document.querySelectorAll('.sticker').forEach(sticker => {
        const relX = parseFloat(sticker.dataset.relX);
        const relY = parseFloat(sticker.dataset.relY);

        const newLeft = relX * window.innerWidth;
        const newTop = relY * window.innerHeight;

        sticker.style.left = `${newLeft}px`;
        sticker.style.top = `${newTop}px`;
    });

    keepStickersInView();
});

function randomRotation(range = 30) {
    return (Math.random() * (range * 2) - range).toFixed(2) + 'deg';
}

document.querySelectorAll('.sticker').forEach(sticker => {
    const finalRotation = randomRotation();

    setTimeout(() => {
        sticker.dataset.finalRotation = finalRotation;
        sticker.style.transform = `rotate(${finalRotation})`;
    }, 100);

    sticker.addEventListener('mousedown', () => {
        sticker.classList.add('grabbing');
        sticker.style.transform = 'rotate(0deg)';
    });

    document.addEventListener('mouseup', () => {
        if (sticker.classList.contains('grabbing')) {
            sticker.classList.remove('grabbing');
            sticker.style.transform = `rotate(${sticker.dataset.finalRotation})`;
        }
    });

    sticker.addEventListener('mouseenter', () => {
        if (!sticker.classList.contains('grabbing')) {
            sticker.style.transform = 'rotate(0deg)';
        }
    });

    sticker.addEventListener('mouseleave', () => {
        if (!sticker.classList.contains('grabbing')) {
            sticker.style.transform = `rotate(${sticker.dataset.finalRotation})`;
        }
    });
});

function keepStickersInView() {
    const stickers = document.querySelectorAll('.sticker');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    stickers.forEach(sticker => {
        const rect = sticker.getBoundingClientRect();
        const stickerWidth = rect.width;
        const stickerHeight = rect.height;

        let left = parseFloat(sticker.style.left);
        let top = parseFloat(sticker.style.top);

        if (left < 0) {
            left = 0;
        } else if (left + stickerWidth > windowWidth) {
            left = windowWidth - stickerWidth;
        }

        if (top < 0) {
            top = 0;
        } else if (top + stickerHeight > windowHeight) {
            top = windowHeight - stickerHeight;
        }

        sticker.style.left = `${left}px`;
        sticker.style.top = `${top}px`;

        sticker.dataset.relX = left / window.innerWidth;
        sticker.dataset.relY = top / window.innerHeight;
    });
}

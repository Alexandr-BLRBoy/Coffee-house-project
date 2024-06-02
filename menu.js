const modalWindow = document.querySelector(".modal_window");
const blur = document.querySelector(".blur");
const body = document.querySelector("body");

//Burger and burger menu
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("burger").addEventListener("click", function () {
    document.querySelector(".header_menu").classList.toggle("open");
  });

  const link = document.querySelectorAll(".burger_item");
  link.forEach((item) => {
    item.addEventListener("click", function () {
      document.querySelector(".header_menu").classList.remove("open");
    });
  });
});

// Menu product

// Tabs categories buttons
const tabCoffee = document.querySelector(".coffee_item");
const tabTea = document.querySelector(".tea_item");
const tabDessert = document.querySelector(".dessert_item");

// Get Product.json
const getProducts = async () => {
  const result = await fetch("./Products.json").then((response) =>
    response.json()
  );

  return result;
};

// Create Card Item
const createCardsItem = (category, products) => {
  const cardsWrapperBlock = document.querySelector(
    ".coffee_container__wrapper"
  );
  cardsWrapperBlock.innerHTML = "";

  const filteredProducts = products.filter((product) => {
    const cat = product.category;

    return cat === category;
  });

  filteredProducts.forEach((elem) => {
    const cardItem = document.createElement("div");
    cardItem.classList.add("menu_coffee__item");
    cardItem.innerHTML = `
        <div class="item_pics">
            <img src="${elem.image}" alt="pics" class="item_img">
        </div>
        <div class="menu_coffee__description">
            <div class="coffee_description__title">
                <h3 class="description_subtitle">${elem.name}</h3>
                <p class="description_text">${elem.description}</p>
            </div>
            <div class="description_price">${elem.price}</div>
        </div>
        `;
    cardsWrapperBlock.appendChild(cardItem);

    // Проходимся методом Map, по массиву с добавками, что бы взять наименование добавки
    const additivesNames = elem.additives.map((additive) => additive.name);

    // Создаем и отображаем модалку при клике на item, если категория кофе, первоначальное состояние
    if (category === "coffee") {
      cardItem.addEventListener("click", () => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("modal_wrapper");
        wrapper.innerHTML = `
                    <div class="modal_img__block">
                        <div class="modal_pics">
                            <img src="${elem.image}" alt="modal-image" class="modal_img">
                        </div>
                    </div>
                    <div class="modal_description__block">
                        <h3 class="modal_title">${elem.name}</h3>
                        <p class="modal_description text">${elem.description}</p>
                        <div class="size_section">
                            <h4 class="size_subtitle">Size</h4>
                            <div class="size_tabs">
                                <div class="size_tab S active" data-size="s">
                                    <p>S</p>
                                    ${elem.sizes.s.size}
                                </div>
                                <div class="size_tab M" data-size="m">
                                    <p>M</p>
                                    ${elem.sizes.m.size}
                                </div>
                                <div class="size_tab L" data-size="l">
                                    <p>L</p>
                                    ${elem.sizes.l.size}
                                </div>
                            </div>
                        </div>
                        <div class="additives_section">
                            <h4 class="additives_subtitle">Additives</h4>
                            <div class="additives_tabs">
                                <div class="additives_tab sugar" data-price="0.5">
                                    <p>1</p>
                                    ${additivesNames[0]}
                                </div>
                                <div class="additives_tab cinnamon" data-price="0.5">
                                    <p>2</p>
                                    ${additivesNames[1]}
                                </div>
                                <div class="additives_tab syrup" data-price="0.5">
                                    <p>3</p>
                                    ${additivesNames[2]}
                                </div>
                            </div>
                        </div>
                        <div class="modal_total">
                            <span class="total_title">Total:</span>
                            <span class="total_sum">${elem.price}</span>
                        </div>
                        <div class="discount">
                            <div class="discount_icon"></div>
                            <p class="discount_description">The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</p>
                        </div>
                        <button class="modal_button">Close</button>
                    </div>
                `;
        modalWindow.append(wrapper);

        // Клик по кнопке Close в модалке(закрываем модалку, убираем blur и применяем overflow = auto)
        const btnClose = document.querySelector(".modal_button");
        btnClose.addEventListener("click", () => {
          modalWindow.classList.remove("active");
          blur.classList.remove("active");
          body.style.overflow = "auto";
          modalWindow.innerHTML = "";
        });

        // Клик по табам с размерами в модалке(при клике на не активный таб, он становится активным, а активный становится не активным)
        const tabSize = document.querySelectorAll(".size_tab");
        const totalSum = document.querySelector(".total_sum");
        tabSize.forEach((item) => {
          item.addEventListener("click", () => {
            // Remove "active" class from all elements
            tabSize.forEach((tab) => {
              tab.classList.remove("active");
            });
            // Add "active" class to the clicked element
            item.classList.add("active");

            // Изменение итоговой суммы Total, при выборе размера(S, M, L)

            const price = parseFloat(
              elem.sizes[item.dataset.size]["add-price"]
            );
            totalSum.textContent = (parseFloat(elem.price) + price).toFixed(2);
          });
        });

        const tabAdditives = document.querySelectorAll(".additives_tab");
        let selectedAdditives = []; // Массив для хранения выбранных добавок

        tabAdditives.forEach((item) => {
          item.addEventListener("click", function () {
            // Переключение класса "active" выбранной вкладки добавки
            item.classList.toggle("active");

            // Получение цены добавки
            let additivePrice = parseFloat(item.getAttribute("data-price"));

            // Проверка, была ли выбрана добавка
            if (item.classList.contains("active")) {
              // Если добавка активирована, проверяем, была ли она уже выбрана
              if (!selectedAdditives.includes(additivePrice)) {
                // Добавление цены выбранной добавки к общей сумме
                selectedAdditives.push(additivePrice);
              }
            } else {
              // Если добавка деактивирована, удаляем ее цену из общей суммы
              let index = selectedAdditives.indexOf(additivePrice);
              if (index !== -1) {
                selectedAdditives.splice(index, 1);
              }
            }

            // Подсчет общей суммы после выбора добавок
            let currentTotal = parseFloat(totalSum.textContent);
            let newTotal =
              currentTotal +
              selectedAdditives.reduce((acc, val) => acc + val, 0);
            totalSum.textContent = newTotal.toFixed(2);
          });
        });

        tabSize.forEach((item) => {
          item.addEventListener("click", function () {
            // Удаление класса "active" у всех вкладок добавок
            tabAdditives.forEach((additive) => {
              additive.classList.remove("active");
            });
          });
        });
      });
    }

    // Слушатель на карточки категории кофе(отображаем модалку, отображаем blur и применяем overflow = hidden)
    cardItem.addEventListener("click", () => {
      modalWindow.classList.add("active");
      blur.classList.add("active");
      body.style.overflow = "hidden";
    });
  });
};

const createPostItem = (category) => {
  getProducts().then((item) => {
    createCardsItem(category, item);
  });
};
createPostItem("coffee");

// Create Card Item before click
const handleTabClick = async () => {
  const createCardsItem = async (elem) => {
    const cardsWrapperBlock = document.querySelector(
      ".coffee_container__wrapper"
    );
    cardsWrapperBlock.innerHTML = "";

    const category = event.currentTarget
      .querySelector("p")
      .innerHTML.toLowerCase();
    const products = await getProducts();
    const filteredProducts = products.filter((product) => {
      const cat = product.category;
      return cat === category;
    });

    // Tabs hover and click effect
    if (category === "coffee") {
      tabCoffee.classList.add("active");
      tabTea.classList.remove("active");
      tabDessert.classList.remove("active");
    } else if (category === "tea") {
      tabTea.classList.add("active");
      tabCoffee.classList.remove("active");
      tabDessert.classList.remove("active");
    } else if (category === "dessert") {
      tabDessert.classList.add("active");
      tabTea.classList.remove("active");
      tabCoffee.classList.remove("active");
    }

    filteredProducts.forEach((elem) => {
      const cardItem = document.createElement("div");
      cardItem.classList.add("menu_coffee__item");
      cardItem.innerHTML = `
            <div class="item_pics">
            <img src="${elem.image}" alt="pics" class="item_img">
            </div>
            <div class="menu_coffee__description">
                <div class="coffee_description__title">
                    <h3 class="description_subtitle">${elem.name}</h3>
                    <p class="description_text">${elem.description}</p>
                </div>
                <div class="description_price">${elem.price}</div>
            </div>
            `;
      cardsWrapperBlock.appendChild(cardItem);

      // Проходимся методом Map, по массиву с добавками, что бы взять их оттуда
      const additivesNamesAfterClick = elem.additives.map(
        (additive) => additive.name
      );

      // Создаем и отображаем модалку при клике на item (Все категории)
      cardItem.addEventListener("click", () => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("modal_wrapper");
        wrapper.innerHTML = `
                    <div class="modal_img__block">
                        <div class="modal_pics">
                            <img src="${elem.image}" alt="modal-image" class="modal_img">
                        </div>
                    </div>
                    <div class="modal_description__block">
                        <h3 class="modal_title">${elem.name}</h3>
                        <p class="modal_description text">${elem.description}</p>
                        <div class="size_section">
                            <h4 class="size_subtitle">Size</h4>
                            <div class="size_tabs">
                                <div class="size_tab S active" data-size="s">
                                    <p>S</p>
                                    ${elem.sizes.s.size}
                                </div>
                                <div class="size_tab M" data-size="m">
                                    <p>M</p>
                                    ${elem.sizes.m.size}
                                </div>
                                <div class="size_tab L" data-size="l">
                                    <p>L</p>
                                    ${elem.sizes.l.size}
                                </div>
                            </div>
                        </div>
                        <div class="additives_section">
                            <h4 class="additives_subtitle">Additives</h4>
                            <div class="additives_tabs">
                                <div class="additives_tab sugar" data-price="0.5">
                                    <p>1</p>
                                    ${additivesNamesAfterClick[0]}
                                </div>
                                <div class="additives_tab cinnamon" data-price="0.5">
                                    <p>2</p>
                                    ${additivesNamesAfterClick[1]}
                                </div>
                                <div class="additives_tab syrup" data-price="0.5">
                                    <p>3</p>
                                    ${additivesNamesAfterClick[2]}
                                </div>
                            </div>
                        </div>
                        <div class="modal_total">
                            <span class="total_title">Total:</span>
                            <span class="total_sum">${elem.price}</span>
                        </div>
                        <div class="discount">
                            <div class="discount_icon"></div>
                            <p class="discount_description">The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</p>
                        </div>
                        <button class="modal_button">Close</button>
                    </div>
                `;
        modalWindow.append(wrapper);

        // Клик по кнопке Close в модалке(закрываем модалку, убираем blur и применяем overflow = auto)
        const btnClose = document.querySelector(".modal_button");
        btnClose.addEventListener("click", () => {
          modalWindow.classList.remove("active");
          blur.classList.remove("active");
          body.style.overflow = "auto";
          modalWindow.innerHTML = "";
        });

        // Клик по табам с размерами в модалке(при клике на не активный таб, он становится активным, а активный становится не активным)
        const tabSize = document.querySelectorAll(".size_tab");
        const totalSum = document.querySelector(".total_sum");
        tabSize.forEach((item) => {
          item.addEventListener("click", () => {
            // Remove "active" class from all elements
            tabSize.forEach((tab) => {
              tab.classList.remove("active");
            });
            // Add "active" class to the clicked element
            item.classList.add("active");

            // Изменение итоговой суммы Total, при выборе размера(S, M, L)

            const price = parseFloat(
              elem.sizes[item.dataset.size]["add-price"]
            );
            totalSum.textContent = (parseFloat(elem.price) + price).toFixed(2);
          });
        });

        const tabAdditives = document.querySelectorAll(".additives_tab");
        let selectedAdditives = []; // Массив для хранения выбранных добавок

        tabAdditives.forEach((item) => {
          item.addEventListener("click", function () {
            // Переключение класса "active" выбранной вкладки добавки
            item.classList.toggle("active");

            // Получение цены добавки
            let additivePrice = parseFloat(item.getAttribute("data-price"));

            // Проверка, была ли выбрана добавка
            if (item.classList.contains("active")) {
              // Если добавка активирована, проверяем, была ли она уже выбрана
              if (!selectedAdditives.includes(additivePrice)) {
                // Добавление цены выбранной добавки к общей сумме
                selectedAdditives.push(additivePrice);
              }
            } else {
              // Если добавка деактивирована, удаляем ее цену из общей суммы
              let index = selectedAdditives.indexOf(additivePrice);
              if (index !== -1) {
                selectedAdditives.splice(index, 1);
              }
            }

            // Подсчет общей суммы после выбора добавок
            let currentTotal = parseFloat(totalSum.textContent);
            let newTotal =
              currentTotal +
              selectedAdditives.reduce((acc, val) => acc + val, 0);
            totalSum.textContent = newTotal.toFixed(2);
          });
        });

        tabSize.forEach((item) => {
          item.addEventListener("click", function () {
            // Удаление класса "active" у всех вкладок добавок
            tabAdditives.forEach((additive) => {
              additive.classList.remove("active");
            });
          });
        });
      });

      // Слушатель на все категории карточек(отображаем модалку, отображаем blur и применяем overflow = hidden)
      cardItem.addEventListener("click", () => {
        modalWindow.classList.add("active");
        blur.classList.add("active");
        body.style.overflow = "hidden";
      });
    });
  };
  await createCardsItem("coffee");
};

// Add Listener to Tabs
const tabs = document.querySelectorAll(".tabs_item");
tabs.forEach((tab) => {
  tab.addEventListener("click", handleTabClick);
});

// Добавление position: fixed, body  при открытии модального окна
document.addEventListener("DOMContentLoaded", () => {
  const modalWindow = document.querySelector(".modal_window");

  const checkModalState = () => {
    if (modalWindow.classList.contains("active")) {
      document.body.style.position = "fixed";
    } else {
      document.body.style.position = "";
    }
  };

  // Проверяем состояние модального окна при загрузке страницы
  checkModalState();

  // Наблюдатель за изменением классов модального окна
  const observer = new MutationObserver(checkModalState);

  observer.observe(modalWindow, {
    attributes: true, // Наблюдаем за изменением атрибутов
    attributeFilter: ["class"], // Но только за атрибутом class
  });
});

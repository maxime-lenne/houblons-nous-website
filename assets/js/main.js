(function () {
  "use strict";

  // Mobile nav menu
  var menuOpenBtn = document.querySelector("[data-menu-open]");
  var menuCloseBtn = document.querySelector("[data-menu-close]");
  var menuPanel = document.querySelector("[data-menu-panel]");

  if (menuOpenBtn && menuCloseBtn && menuPanel) {
    var openMenu = function () {
      menuPanel.classList.add("is-open");
      menuOpenBtn.setAttribute("aria-expanded", "true");
    };
    var closeMenu = function () {
      menuPanel.classList.remove("is-open");
      menuOpenBtn.setAttribute("aria-expanded", "false");
    };

    menuOpenBtn.addEventListener("click", openMenu);
    menuCloseBtn.addEventListener("click", closeMenu);
    menuPanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  // Scroll-reveal — fades/translates .reveal elements into view once.
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.setAttribute("data-visible", "true");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealEls.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.setAttribute("data-visible", "true");
      });
    }
  }

  // /quartier événements category filter
  var filterGroup = document.querySelector("[data-event-filters]");
  var eventList = document.querySelector("[data-event-list]");
  var emptyState = document.querySelector("[data-event-empty]");

  if (filterGroup && eventList) {
    var items = eventList.querySelectorAll("[data-category]");

    filterGroup.addEventListener("click", function (event) {
      var button = event.target.closest("[data-filter]");
      if (!button) return;

      var filter = button.getAttribute("data-filter");

      filterGroup.querySelectorAll("[data-filter]").forEach(function (btn) {
        btn.setAttribute("aria-pressed", String(btn === button));
      });

      var visibleCount = 0;
      items.forEach(function (item) {
        var match = filter === "tous" || item.getAttribute("data-category") === filter;
        item.closest("li").hidden = !match;
        if (match) visibleCount += 1;
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
    });
  }
})();

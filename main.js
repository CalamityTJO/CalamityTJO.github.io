// Calamity portfolio interactions. Plain JS, no dependencies.
(function () {
	"use strict";

	var body = document.body;

	/* ---- Light/dark theme toggle (persisted) ---- */
	var themeToggle = document.getElementById("themeToggle");
	function applyTheme(theme) {
		body.setAttribute("data-theme", theme);
		if (themeToggle) {
			var icon = themeToggle.querySelector(".theme-icon");
			if (icon) icon.textContent = theme === "light" ? "☀️" : "🌙";
		}
	}
	var savedTheme = null;
	try {
		savedTheme = localStorage.getItem("theme");
	} catch (e) {}
	if (!savedTheme && window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
		savedTheme = "light";
	}
	applyTheme(savedTheme === "light" ? "light" : "dark");

	if (themeToggle) {
		themeToggle.addEventListener("click", function () {
			var next = body.getAttribute("data-theme") === "light" ? "dark" : "light";
			applyTheme(next);
			try {
				localStorage.setItem("theme", next);
			} catch (e) {}
		});
	}

	/* ---- Hero rotator ---- */
	var rotator = document.getElementById("rotator");
	if (rotator) {
		var words = ["reliability", "performance", "clean architecture", "server authority"];
		var index = 0;
		setInterval(function () {
			index = (index + 1) % words.length;
			rotator.style.opacity = "0";
			setTimeout(function () {
				rotator.textContent = words[index];
				rotator.style.opacity = "1";
			}, 200);
		}, 2600);
		rotator.style.transition = "opacity 0.2s ease";
	}

	/* ---- Toast ---- */
	var toast = document.getElementById("toast");
	var toastTimer = null;
	function showToast(message) {
		if (!toast) return;
		toast.textContent = message;
		toast.classList.add("show");
		if (toastTimer) clearTimeout(toastTimer);
		toastTimer = setTimeout(function () {
			toast.classList.remove("show");
		}, 1800);
	}

	/* ---- Click-to-copy contacts ---- */
	var copyEls = document.querySelectorAll("[data-copy]");
	Array.prototype.forEach.call(copyEls, function (el) {
		el.addEventListener("click", function (event) {
			var value = el.getAttribute("data-copy");
			if (!navigator.clipboard) return; // let the default link behavior happen
			event.preventDefault();
			navigator.clipboard.writeText(value).then(
				function () {
					showToast("Copied: " + value);
				},
				function () {
					window.location.href = el.getAttribute("href");
				}
			);
		});
	});

	/* ---- Scroll reveal ---- */
	var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	if ("IntersectionObserver" in window && !reduceMotion) {
		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					entry.target.classList.add("in-view");
					observer.unobserve(entry.target);
				});
			},
			{ threshold: 0.15 }
		);
		Array.prototype.forEach.call(document.querySelectorAll(".reveal"), function (el) {
			observer.observe(el);
		});
	} else {
		Array.prototype.forEach.call(document.querySelectorAll(".reveal"), function (el) {
			el.classList.add("in-view");
		});
	}

	/* ---- Back to top ---- */
	var backToTop = document.getElementById("backToTop");
	if (backToTop) {
		window.addEventListener("scroll", function () {
			if (window.scrollY > 400) backToTop.classList.add("show");
			else backToTop.classList.remove("show");
		});
		backToTop.addEventListener("click", function () {
			window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
		});
	}

	/* ---- Konami-code easter egg: cursor spark trail ---- */
	var sequence = [
		"ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
		"ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
	];
	var progress = 0;
	var trailOn = false;
	var lastSpark = 0;

	document.addEventListener("keydown", function (event) {
		var key = event.key;
		var expected = sequence[progress];
		if (key.toLowerCase() === expected.toLowerCase()) {
			progress += 1;
			if (progress === sequence.length) {
				progress = 0;
				trailOn = !trailOn;
				showToast(trailOn ? "Trail mode on" : "Trail mode off");
			}
		} else {
			progress = key === sequence[0] ? 1 : 0;
		}
	});

	document.addEventListener("mousemove", function (event) {
		if (!trailOn) return;
		var now = Date.now();
		if (now - lastSpark < 24) return;
		lastSpark = now;
		var spark = document.createElement("div");
		spark.className = "cursor-spark";
		spark.style.left = event.clientX - 3 + "px";
		spark.style.top = event.clientY - 3 + "px";
		document.body.appendChild(spark);
		requestAnimationFrame(function () {
			spark.style.opacity = "0";
			spark.style.transform = "scale(0.2)";
		});
		setTimeout(function () {
			if (spark.parentNode) spark.parentNode.removeChild(spark);
		}, 500);
	});

	/* ---- Footer year ---- */
	var footer = document.querySelector("footer .container");
	if (footer) {
		footer.textContent = "Calamity, built with plain HTML/CSS/JS, hosted on GitHub Pages · " + new Date().getFullYear();
	}
})();

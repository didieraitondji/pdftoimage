// Validate page range input
function validatePageRange(input) {
  const value = input.value.trim();
  const errorElement = document.getElementById("range-error");

  if (value === "") {
    errorElement.classList.add("hidden");
    return true;
  }

  // Valid patterns: 1,2,3 or 1-3 or 1,3-5,7
  const isValid = /^(\d+(-\d+)?)(,\s*\d+(-\d+)?)*$/.test(value);

  if (isValid) {
    errorElement.classList.add("hidden");
  } else {
    errorElement.classList.remove("hidden");
  }

  return isValid;
}

// Handle form submission
document
  .getElementById("convert-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate inputs
    const fileInput = document.getElementById("pdf-file");
    const pageRangeInput = document.getElementById("page-range");

    if (!fileInput.files.length) {
      document.getElementById("file-error").textContent =
        "Please select a PDF file";
      document.getElementById("file-error").classList.remove("hidden");
      return;
    }

    if (!validatePageRange(pageRangeInput)) {
      return;
    }

    // Show loading overlay
    document.getElementById("loading-overlay").classList.remove("hidden");

    const formData = new FormData();
    formData.append("pdf-file", fileInput.files[0]);
    formData.append(
      "image-format",
      document.getElementById("image-format").value
    );
    formData.append("page-range", pageRangeInput.value);

    try {
      const response = await fetch("/convert", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Display results
        const gallery = document.getElementById("image-gallery");
        gallery.innerHTML = "";

        data.images.forEach((image, index) => {
          const imgContainer = document.createElement("div");
          imgContainer.className =
            "bg-white p-4 rounded-lg shadow flex flex-col";

          // Conteneur pour l'image (en haut)
          const imgWrapper = document.createElement("div");
          imgWrapper.className = "mb-4";

          const img = document.createElement("img");
          img.src = image.url;
          img.alt = `Page ${image.page}`;
          img.className = "w-full h-auto rounded";

          imgWrapper.appendChild(img);

          // Conteneur pour la ligne inférieure (page + bouton)
          const bottomRow = document.createElement("div");
          bottomRow.className = "flex justify-between items-center mt-auto";

          // Numéro de page à gauche
          const pageNumber = document.createElement("span");
          pageNumber.className = "text-gray-600 font-medium";
          pageNumber.textContent = `Page ${image.page}`;

          // Bouton de téléchargement à droite
          const downloadBtn = document.createElement("a");
          downloadBtn.href = image.url;
          downloadBtn.download = `${image.name}`;
          downloadBtn.className =
            "inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors";
          downloadBtn.innerHTML = `<i class="bx bx-download mr-2"></i> Download`;

          // Assemblage des éléments
          bottomRow.appendChild(pageNumber);
          bottomRow.appendChild(downloadBtn);

          imgContainer.appendChild(imgWrapper);
          imgContainer.appendChild(bottomRow);

          gallery.appendChild(imgContainer);
        });

        // Set up download all button
        document.getElementById("download-all").onclick = () => {
          data.images.forEach((image) => {
            const link = document.createElement("a");
            link.href = image.url;
            link.download = `page_${image.page}.${data.format}`;
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
        };

        // Show results section
        document.getElementById("results-section").classList.remove("hidden");
      } else {
        alert(data.error || "Error during conversion");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during conversion");
    } finally {
      // Hide loading overlay
      document.getElementById("loading-overlay").classList.add("hidden");
    }
  });

// le script de glissé déposé

// Gestion du drag & drop
const fileInput = document.getElementById("pdf-file");
const dropZone = document.querySelector(".border-dashed");

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, highlight, false);
});

["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight() {
  dropZone.classList.add("border-blue-500", "bg-blue-50");
}

function unhighlight() {
  dropZone.classList.remove("border-blue-500", "bg-blue-50");
}

dropZone.addEventListener("drop", handleDrop, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files.length && files[0].type === "application/pdf") {
    fileInput.files = files;
  }
}

// gestion du menu

// affichage du nom du pdf
document.getElementById("pdf-file").addEventListener("change", function (e) {
  const fileNameDisplay = document.getElementById("file-name-display");
  if (this.files && this.files.length > 0) {
    fileNameDisplay.textContent = "Current file : " + this.files[0].name;
  } else {
    fileNameDisplay.textContent = "";
  }
});

//
document.addEventListener("DOMContentLoaded", function () {
  // Sélection des éléments
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const mobileMenu = document.getElementById("mobileMenu");
  const menuToggle = document.getElementById("menuToggle");

  // Fonction pour mettre à jour l'état actif
  function setActiveLink() {
    // Vérifie d'abord l'ancre dans l'URL
    const hash = window.location.hash;

    // Si une ancre est présente dans l'URL
    if (hash) {
      navLinks.forEach((link) => {
        link.classList.remove("text-blue-600", "bg-blue-50");
        if (link.getAttribute("href") === hash) {
          link.classList.add("text-blue-600", "bg-blue-50");
        }
      });
      return;
    }

    // Sinon, vérifie la position de scroll
    const scrollPosition = window.scrollY + 100;
    let currentSection = null;

    document.querySelectorAll("section[id]").forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSection = `#${section.id}`;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("text-blue-600", "bg-blue-50");
      if (link.getAttribute("href") === currentSection) {
        link.classList.add("text-blue-600", "bg-blue-50");
      }
    });
  }

  // Écouteurs d'événements
  window.addEventListener("scroll", setActiveLink);
  window.addEventListener("hashchange", setActiveLink);

  // Gestion du menu mobile
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      menuToggle.innerHTML = mobileMenu.classList.contains("hidden")
        ? '<i class="bx bx-menu text-2xl"></i>'
        : '<i class="bx bx-x text-2xl"></i>';
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        menuToggle.innerHTML = '<i class="bx bx-menu text-2xl"></i>';
      });
    });
  }

  // Initialisation
  setActiveLink();
});

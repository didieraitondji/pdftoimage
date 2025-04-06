# 🖼️ PDF to Image Converter

<img src="./public/assets/logo_PDF2Image_y.png" alt="Project Banner" width="400"/>

Un outil web simple et efficace pour convertir des fichiers PDF en images (PNG, JPEG, WebP).

---

## ✨ Fonctionnalités

- 📄 **Conversion multi-format** : export en **PNG**, **JPEG** ou **WebP**
- 🔢 **Sélection de pages** : convertissez des pages spécifiques ou l’intégralité du document
- 🖱️ **Interface intuitive** : glisser-déposer et prévisualisation des fichiers
- 📱 **Responsive design** : compatible mobile, tablette et desktop
- 📦 **Téléchargement groupé** : possibilité de télécharger toutes les images dans une archive `.zip`

---

## 🛠️ Technologies utilisées

### Frontend

- HTML5, Tailwind CSS  
- JavaScript (ES6+)
- [`pdf2pic`](https://www.npmjs.com/package/pdf2pic) (pour la conversion côté client)

### Backend (optionnel)

- Node.js avec Express
- Multer (gestion des fichiers uploadés)
- ImageMagick (traitement des images)

---

## 🚀 Installation

### 🔹 Option 1 : Version client uniquement

1. Téléchargez les fichiers du projet
2. Ouvrez `index.html` dans votre navigateur

---

### 🔹 Option 2 : Version complète avec backend

#### 📥 Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/pdf-to-image-converter.git
```

#### 📦 Installer les dépendances

```bash
npm install
```

#### ▶️ Lancer le serveur

```bash
node server.js
```

Le serveur sera accessible à l’adresse :  
`http://localhost:3000`

---

## ⚙️ Utilisation

1. **Uploader votre PDF**  
   - Cliquez sur la zone de dépôt ou glissez-déposez votre fichier  
   - Les PDF jusqu’à **10 Mo** sont acceptés

2. **Configurer les options**  
   - Choisissez le format de sortie (par défaut : **PNG**)  
   - Indiquez les pages à convertir (exemple : `1-3,5`)

3. **Convertir et télécharger**  
   - Cliquez sur **"Convert to Images"**  
   - Visualisez les images générées  
   - Téléchargez-les individuellement ou toutes en une seule fois

---

## 📄 Licence

Ce projet est sous licence **MIT**.  
Libre à vous de l’utiliser, le modifier et le distribuer.
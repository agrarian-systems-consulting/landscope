# Landscope

L’Alliance pour la Préservation des Forêts fournit des données et outils pour donner les moyens aux entreprises françaises de mieux protéger les forêts. Landscope est une cartographie de projets qui allient des objectifs de protection des ressources naturelles avec des objectifs de développement économique, et qui mobilisent une approche paysagère. Les projets identifiés sont le fruit d’un travail de revue de la littérature existante réalisé en Mai 2020. Cette application permet de visualiser ces projets.

## Getting Started

Ces instructions vous permettront d'obtenir une copie du projet sur votre machine locale à des fins de développement et de test. Consultez la section "Déploiement" pour obtenir des notes sur la manière de déployer le projet sur un système réel.

### Prerequisites

Cette application React utilise [yarn](https://yarnpkg.com/) pour la gestion de ses packages. Il doit être possible de les gérer avec [npm](https://www.npmjs.com/), cependant nous ne pouvons pas garantir du bon fonctionnement de l'application avec npm.

### Installing

Voici une série d'instructions qui vous expliquent, étape par étape, comment faire fonctionner un environnement de développement pour cette application.

#### Cloner ce dépôt

```
git clone https://github.com/Geomatick/asc.git
```

#### Installer les dépendances

```
yarn install
```

#### Lancer le serveur de développement

```
yarn start
```

_Attention_ : cette application est connectée directement au serveur cartographique en production.

## Deployment

```
yarn build
```

Cette application a été créée avec [Create-react-app](https://github.com/facebook/create-react-app). Toutes les informations relatives au déploiement sont disponibles sur le site de React.

Pour optimiser le rendu, il est possible d'activer le service worker dans `App.jsx`

Pour tester l'application, il est possible de la déployer rapidement sur Firebase Hosting

```
firebase deploy
```

## Built With

- [React](https://fr.reactjs.org/) - The web framework used
- [Yarn](https://yarnpkg.com/) - Dependency Management
- [React-router](https://reacttraining.com/react-router/web/guides/quick-start) - Routing management in react. Toutes les routes sont accessibles dans `src/app/layout/App.jsx`
- [Semantic-ui-react](https://react.semantic-ui.com/) - Front-end framework
- [Formik](https://github.com/jaredpalmer/formik) - Build forms in React
- [Yup](https://github.com/jquense/yup) - Form validation
- [Openlayers](https://www.npmjs.com/package/ol) - Create maps
- [Firebase](https://firebase.google.com/docs/auth) - User authentication

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

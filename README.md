# react-angular-d3-comparison
A comparison of using Angular or React to build a d3 visualization

![d3-visualization-example](https://user-images.githubusercontent.com/1707103/71593500-5e491c00-2b02-11ea-8a96-1dfb56488615.gif)

## React App

#### Creation

```bash
npx create-react-app react-app
cd react-app

# Start the application
yarn start
```

## Angular App

#### Creation

```bash
npm install -g @angular/cli
ng new angular-app
cd angular-app

# Helper methods for easily creating and implementing needed components
ng generate component visualization
ng generate component visualization/axes
ng generate component visualization/marker

# Start the application
npm start
```

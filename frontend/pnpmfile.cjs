// pnpmfile.cjs
module.exports = {
  hooks: {
    readPackage(pkg) {
      // Allow core-js or any other package to run build scripts
      if (pkg.name === "core-js") {
        pkg.scripts = pkg.scripts || {};
      }
      return pkg;
    },
  },
};

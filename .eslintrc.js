module.exports = {
	"extends": "airbnb",
	"plugins": ["react", "jsx-a11y", "import"],
	"env": {
		"browser": true,
		"node": true,
	},
	"rules": {
		"indent": ["error", "tab"],
		"semi": ["error", "never"],
		"camelcase": 0,

		"no-tabs": 0,
		"no-param-reassign": 0,
		"no-return-assign": 0,

		"object-curly-newline": 0,
		"object-curly-spacing": ["error", "never"],

		"react/jsx-one-expression-per-line": 0,
		"react/destructuring-assignment": 0,
		"react/jsx-indent": [2, 'tab'],
		"react/react-in-jsx-scope": 0,
		"react/prop-types": 0,
		"react/jsx-indent-props": 0,

		"jsx-a11y/click-events-have-key-events": 0,
		"jsx-a11y/no-static-element-interactions": 0,
		"jsx-a11y/no-noninteractive-element-interactions": 0,
	},
	"settings": {
		"react": {
			"pragma": "h"
		}
	}
};

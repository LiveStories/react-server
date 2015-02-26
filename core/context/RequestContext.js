
var ObjectGraph = require('../util/ObjectGraph'),
	Navigator = require('./Navigator'),
	RequestLocals = require('../util/RequestLocalStorage').getNamespace(),
	Q = require('q'),
	TritonAgent = require('../util/TritonAgent'),
	config = require('../config'),
	logger = require('../logging').getLogger(__LOGGER__);

// TODO FIXME
var REFERRER_DOMAIN = "http://node.redfintest.com";

class RequestContext {

	constructor (routes, extraOpts) {

		this.navigator = new Navigator(this, routes);

		this._navigateListeners = [];

		this.registerRequestLocal();
	}

	static getCurrentRequestContext () {
		return RequestLocals().instance;
	}

	// when we transition from page to page, we clear out the RequestLocals, but we need to re-register
	// the RequestContext in the RequestLocals.
	registerRequestLocal() {
		RequestLocals().instance = this;
	}

	setDataLoadWait (ms) {
		this.dataLoadWait = ms
		return this
	}

	getDataLoadWait (ms) {
		return this.dataLoadWait
	}

	setServerStash (stash) {
		this.serverStash = stash;
		return this;
	}

	getServerStash () {
		return this.serverStash;
	}

	onNavigate (callback) {
		this.navigator.on('navigateDone', callback);
	}

	onNavigateStart (callback) {
		this.navigator.on('navigateStart', callback);
	}

	navigate (request, type) {
		this.navigator.navigate(request, type);
	}

	dehydrate () {
		return {
			'TritonAgent.cache': TritonAgent.cache().dehydrate()
		}
	}

	rehydrate (state) {
		TritonAgent.cache().rehydrate(state['TritonAgent.cache']);
	}

}

class RequestContextBuilder {

	constructor () {
	}

	setRoutes(routes) {
		this.routes = routes;
		return this;
	}

	setDefaultXhrHeadersFromRequest (req) {
		return this;
	}

	create (extraOpts) {

		return new RequestContext(this.routes, extraOpts);
	}

}

module.exports = RequestContext;
module.exports.Builder = RequestContextBuilder;


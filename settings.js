export default (() => {
	/**
	 *
	 * @param value
	 * @returns {boolean}
	 */
	Array.prototype.uniquePush = function (value) {
		const inc = this.includes(value)
		if (!inc) this.push(value)
		return !inc
	}
})()
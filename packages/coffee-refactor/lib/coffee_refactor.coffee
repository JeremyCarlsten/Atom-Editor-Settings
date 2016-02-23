Ripper = require './ripper'
{ packages: packageManager } = atom


module.exports =
    config:
        'maxWorkChars':
            title       : 'disable in large files (chars)'
            type        : 'integer'
            default     : 20000
            order       : 1

    activate: ->
        return if 'refactor' in packageManager.getAvailablePackageNames() and
            !packageManager.isPackageDisabled 'refactor'

        atom.notifications.addWarning "Requires related package installation",
            detail: """
            'coffee-refactor' package requires 'refactor' package.
            You can install and activate packages using the preference pane.
            """
    deactivate: ->
    serialize: ->
    Ripper: Ripper

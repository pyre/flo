# -*- Python -*-
# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#


# import and publish pyre symbols
from pyre import (
    # protocols, components and traits
    schemata, constraints, properties, protocol, component, foundry,
    # decorators
    export, provides,
    # the manager of the pyre runtime
    executive,
    # hosting strategies
    application, plexus,
    # support for persistence
    db, records, tabular,
    # support for work flows
    flow,
    # miscellaneous
    tracking, units, weaver
    )


# bootstrap
package = executive.registerPackage(name='flo', file=__file__)
# save the geography
home, prefix, defaults = package.layout()

# publish local modules
from . import (
    meta,     # meta-data
    model,    # product and factory specifications
    isce3,    # product and factory implementations
    schema,   # the layout of the information in the persistence support
    queries,  # access to the data store

    # user interface
    shells,   # application support
    cli,      # the command panels
    )

# singletons
wgs84 = isce3.newEllipsoid(name="wgs84")


# administrivia
def copyright():
    """
    Return the copyright note
    """
    # pull and print the meta-data
    return print(meta.header)


def license():
    """
    Print the license
    """
    # pull and print the meta-data
    return print(meta.license)


def built():
    """
    Return the build timestamp
    """
    # pull and return the meta-data
    return meta.date


def credits():
    """
    Print the acknowledgments
    """
    return print(meta.acknowledgments)


def version():
    """
    Return the version
    """
    # pull and return the meta-data
    return meta.version


# end of file

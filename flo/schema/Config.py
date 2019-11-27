# -*- Python -*-
# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#


# support
import flo
# access to the table of flow
from .Flow import Flow


# table declaration
class Config(flo.db.table, id="config"):
    """
    Table of product and factory configurations
    """


    # identify this setting with a particular flow
    flow = flo.db.reference(key=Flow.flow)
    # product and factory instance names are globally unique
    name = flo.db.str().notNull()
    # the value
    value = flo.db.str().notNull()


# end of file

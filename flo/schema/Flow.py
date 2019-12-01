# -*- Python -*-
# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#


# support
import flo


# table declaration
class Flow(flo.db.table, id="flows"):
    """
    Table of flows
    """


    # flow instance names are globally unique
    flow = flo.db.str().primary()
    type = flo.db.str()


# end of file

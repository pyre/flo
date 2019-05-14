#!/usr/bin/env python3
# -*- Python -*-
# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#


# get the package
import flo

# my app
class Load(flo.application, family="flo.applications.load"):
    """
    Examine the flow node naming strategy
    """


    # configurable state
    flow = flo.flow.flow()
    flow.doc = "my flow node container"


    # interface
    @flo.export
    def main(self, *args, **kwds):
        """
        The main entry point
        """
        # show me
        self.flow.pyre_dump(channel=self.info)
        # all done
        return 0


# bootstrap
if __name__ == "__main__":
    # instantiate
    app = Load(name="load")
    # invoke
    status = app.run()
    # and share
    raise SystemExit(status)


# end of file

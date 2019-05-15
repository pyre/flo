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
class Save(flo.application, family="flo.applications.save"):
    """
    Examine the flow node naming strategy
    """

    # user configurable state
    flow = flo.flow.flow()
    flow.doc = "my flow node container"


    # interface
    @flo.export
    def main(self, *args, **kwds):
        """
        The main entry point
        """
        # make a channel
        channel = self.info

        # make a couple of SLC factories
        f1 = flo.isce.newFormSLC()
        f2 = flo.isce.newFormSLC()

        # configure their inputs
        f1.raw.samples = 10000
        f1.raw.lines = 30000
        f2.raw.samples = 10000
        f2.raw.lines = 30000

        # make interferogram factory
        resamp = flo.isce.newResamp()
        # bind it
        resamp.reference = f1.slc
        resamp.target = f2.slc

        # get my flow
        flow = self.flow
        # add the products and factories
        flow.factories = {f1, f2, resamp}
        flow.products = {f1.raw, f2.raw, f1.slc, f2.slc, resamp.interferogram}

        # make the interferogram
        resamp.interferogram.pyre_make()

        # and ask it to render itself
        flow.save()

        # all done
        return 0


# bootstrap
if __name__ == "__main__":
    # instantiate
    app = Save(name="save")
    # invoke
    status = app.run()
    # and share
    raise SystemExit(status)


# end of file

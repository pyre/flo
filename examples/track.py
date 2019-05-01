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
class Names(flo.flow.workflow, family="flo.applications.names"):
    """
    Examine the flow node naming strategy
    """


    # interface
    @flo.export
    def main(self, *args, **kwds):
        """
        The main entry point
        """
        # make a new SLC factory
        f = flo.isce.newFormSLC()

        # access the input
        raw = f.raw
        # and the output
        s1 = f.slc
        # modify
        f.slc = flo.isce.newSLC()

        # make a channel
        channel = self.info
        # show me
        channel.line(f"slc factory: {f}")
        channel.line(f"    raw: {f.raw}")
        channel.line(f"    slc: {f.slc}")
        channel.line(f"    inputs:")
        for input in f.pyre_inputs:
            # get the actual product
            product = f.pyre_inventory[input].value
            channel.line(f"       {product}")
        channel.line(f"    outputs:")
        for output in f.pyre_outputs:
            product = f.pyre_inventory[output].value
            channel.line(f"       {product}")
        channel.line(f"    history:")

        # grab the formSLC tracker
        tracker = f.status

        # show me the history of {raw}
        channel.line(f"        raw:")
        # go through all the known values
        for idx, rev in enumerate(tracker.playback(alias="raw")):
            # get the name
            name = None if rev.value is None else rev.value.pyre_name
            # and print each one
            channel.line(f"        {idx:3}:")
            channel.line(f"            value: {name}")
            channel.line(f"            locator: {rev.locator}")
            channel.line(f"            priority: {rev.priority}")

        # show me the history of {slc}
        channel.line(f"        slc:")
        # go through all the known values
        for idx, rev in enumerate(tracker.playback(alias="slc")):
            # get the name
            name = None if rev.value is None else rev.value.pyre_name
            # and print each one
            channel.line(f"        {idx:3}:")
            channel.line(f"            value: {name}")
            channel.line(f"            locator: {rev.locator}")
            channel.line(f"            priority: {rev.priority}")

        # flush
        channel.log()

        # all done
        return 0


# bootstrap
if __name__ == "__main__":
    # instantiate
    app = Names(name="names")
    # invoke
    status = app.run()
    # and share
    raise SystemExit(status)


# end of file

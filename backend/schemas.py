from typing import Literal

from pydantic import BaseModel


class CarEvaluationData(BaseModel):
    buying: Literal["vhigh", "high", "med", "low"]
    maint: Literal["vhigh", "high", "med", "low"]
    doors: Literal["2", "3", "4", "5more"]
    persons: Literal["2", "4", "more"]
    lug_boot: Literal["small", "med", "big"]
    safety: Literal["low", "med", "high"]
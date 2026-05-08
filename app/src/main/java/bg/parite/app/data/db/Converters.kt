package bg.parite.app.data.db

import androidx.room.TypeConverter
import bg.parite.app.data.model.CategoryKind
import bg.parite.app.data.model.RecurrenceFreq
import bg.parite.app.data.model.TxnType

class Converters {
    @TypeConverter fun txnTypeToString(t: TxnType?): String? = t?.name
    @TypeConverter fun stringToTxnType(s: String?): TxnType? = s?.let { TxnType.valueOf(it) }

    @TypeConverter fun catKindToString(k: CategoryKind?): String? = k?.name
    @TypeConverter fun stringToCatKind(s: String?): CategoryKind? = s?.let { CategoryKind.valueOf(it) }

    @TypeConverter fun freqToString(f: RecurrenceFreq?): String? = f?.name
    @TypeConverter fun stringToFreq(s: String?): RecurrenceFreq? = s?.let { RecurrenceFreq.valueOf(it) }
}

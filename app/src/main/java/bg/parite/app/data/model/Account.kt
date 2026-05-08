package bg.parite.app.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "accounts")
data class Account(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val nameKey: String? = null,
    val currency: String,
    val openingMinor: Long = 0,
    val colorHex: String,
    val emoji: String,
    val sortOrder: Int = 0,
    val archived: Boolean = false,
)
